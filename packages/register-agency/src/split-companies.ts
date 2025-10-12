import { promises as fs } from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { Storage } from './lib/storage';
import convert from 'xml-js';

dotenv.config();

class SplitCompanies {
  async doit() {
    const dir = path.join(process.cwd(), './.xml-data');
    let db = new Storage();

    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      let deeds;

      try {
        const data = JSON.parse(convert.xml2json(String(await fs.readFile(filePath)), {
          compact: true,
        }));
        deeds = data.Message.Body.Deeds.Deed;
      } catch (err: any) {
        console.error(err);
        continue;
      }

      console.log(deeds);

      if (!Array.isArray(deeds)) {
        deeds = [deeds];
      }

      for (const deed of deeds) {
        let uic = deed._attributes.UIC;
        let incomingPackageInfos = deed?.IncomingPackageInfo;
        let subDeeds = deed?.SubDeed;

        if (!Array.isArray(incomingPackageInfos)) {
          incomingPackageInfos = [incomingPackageInfos];
        }

        if (!Array.isArray(subDeeds)) {
          subDeeds = [subDeeds];
        }

        const tmpNumber = incomingPackageInfos?.[0]?._attributes?.IncomingNumber;

        const dirParts = [uic.slice(0, 2), uic.slice(2, 4), uic.slice(4, 6), uic.slice(6, 9)].join('/');

        const tmpDir = path.join(dir, `../BRRA-JSON-SORT/${dirParts}/`);
        const tmpFile = `${uic}-${tmpNumber}.json`;

        await db.addParsedFile();

        // await fs.mkdir(tmpDir, {
        //   recursive: true,
        // });
        // await fs.writeFile(`${tmpDir}/${tmpFile}`, JSON.stringify(deed, null, 2));

        console.log(`${tmpDir}/${tmpFile}`);
      }
    }
  }
}

(async () => {
  const splitter = new SplitCompanies();

  await splitter.doit();
})();
