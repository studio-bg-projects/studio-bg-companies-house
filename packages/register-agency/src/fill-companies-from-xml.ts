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

      let hasChanges = [];
      let company = await db.companyGet(uic);

      if (!company) {
        company = {
          uic,
          data: {},
        };

        hasChanges.push('ADD');
      }

      let incomingPackageInfos = deed?.IncomingPackageInfo;
      let subDeeds = deed?.SubDeed;

      if (!Array.isArray(incomingPackageInfos)) {
        incomingPackageInfos = [incomingPackageInfos];
      }

      if (!Array.isArray(subDeeds)) {
        subDeeds = [subDeeds];
      }

      // Collect data
      for (const [subDeedIdx, subDeed] of Object.entries(subDeeds as Record<number, any>)) {
        const leadingApp = incomingPackageInfos?.[subDeedIdx]?._attributes?.LeadingApp;

        if (leadingApp !== 'A4') {
          continue;
        }

        for (const [deedValueKey, deedValue] of Object.entries(subDeed as Record<string, any>)) {
          if (deedValueKey === '_attributes') {
            continue;
          }

          const currentEntryNumber = parseInt(company?.data?.[deedValueKey]?._attributes?.FieldEntryNumber);
          const newEntryNumber = parseInt(deedValue?._attributes?.FieldEntryNumber);

          if (!currentEntryNumber || currentEntryNumber < newEntryNumber) {
            company.data[deedValueKey] = deedValue;

            hasChanges.push(deedValueKey);
          }
        }
      }

      if (hasChanges.length && Object.keys(company.data).length) {
        console.log(company.uic, hasChanges.join(', '));
        await db.companyAppend(company);
      }
    }
  }
}

(async () => {
  const splitter = new FillCompaniesFromXml();

  await splitter.doit();

  console.log('BYE BYE :)');
  process.exit(0);
})();
