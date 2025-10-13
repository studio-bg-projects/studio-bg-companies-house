import { promises as fs } from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { Storage } from './lib/storage';
import convert from 'xml-js';

dotenv.config();

class FillCompaniesFromXml {
  async doit() {
    const dir = path.join(process.cwd(), './.xml-data');

    console.log('Start file indexing');

    const files = await this.collectXmlFiles(dir);
    const db = new Storage();

    console.log(`Get ${files.length} files`);
    for (const xmlFile of files) {
      await this.parseFile(db, xmlFile);
    }
  }

  async collectXmlFiles(dirPath: string, fileList: string[] = []) {
    const entries = await fs.readdir(dirPath, {withFileTypes: true});

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await this.collectXmlFiles(fullPath, fileList);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.xml')) {
        fileList.push(fullPath);
      }
    }

    return fileList;
  }

  async parseFile(db: Storage, xmlFile: string) {
    // Check is parsed
    let baseName = path.basename(xmlFile);

    if (await db.parsedFileGet(baseName)) {
      console.log(`Skip file ${baseName}`);
      return;
    }

    await db.parsedFileAdd(baseName);

    // Parse
    let deeds;

    try {
      const data = JSON.parse(convert.xml2json(String(await fs.readFile(xmlFile)), {
        compact: true,
      }));
      deeds = data?.Message?.Body?.Deeds?.Deed;
    } catch (err: any) {
      console.error(err);
      return;
    }

    if (!deeds) {
      return;
    }

    if (!Array.isArray(deeds)) {
      deeds = [deeds];
    }

    for (const deed of deeds) {
      let uic = deed?._attributes?.UIC;

      if (!uic) {
        continue;
      }

      console.log('uic', uic);
      let company = await db.companyGet(uic);

      if (!company) {
        company = {
          uic,
          deeds: [],
        };

        await db.companyAdd(company);
      }

      company.deeds.push(deed);

      await db.companyDeedSet(company.uic, company.deeds);

      continue;

      let incomingPackageInfos = deed?.IncomingPackageInfo;
      let subDeeds = deed?.SubDeed;

      if (!Array.isArray(incomingPackageInfos)) {
        incomingPackageInfos = [incomingPackageInfos];
      }

      if (!Array.isArray(subDeeds)) {
        subDeeds = [subDeeds];
      }

      // const tmpNumber = incomingPackageInfos?.[0]?._attributes?.IncomingNumber;

      // const dirParts = [uic.slice(0, 2), uic.slice(2, 4), uic.slice(4, 6), uic.slice(6, 9)].join('/');

      // const tmpDir = path.join(dir, `../BRRA-JSON-SORT/${dirParts}/`);
      // const tmpFile = `${uic}-${tmpNumber}.json`;

      // await db.addParsedFile();

      // await fs.mkdir(tmpDir, {
      //   recursive: true,
      // });
      // await fs.writeFile(`${tmpDir}/${tmpFile}`, JSON.stringify(deed, null, 2));

      // console.log(`${tmpDir}/${tmpFile}`);
    }
  }
}

(async () => {
  const splitter = new FillCompaniesFromXml();

  await splitter.doit();
})();
