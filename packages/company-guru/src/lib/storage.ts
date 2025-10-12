import * as mysql from 'mysql2/promise';
import { config } from './config';

export class Storage {
  protected conn: mysql.Connection | null = null;

  async mainActivitySet(mainActivities: any[]): Promise<void> {
    const db = await this.getDb();

    for (const item of mainActivities) {
      await db.execute(`
        INSERT IGNORE INTO
          \`companyGuruMainActivity\`
        (
          \`cid\`,
          \`bg\`,
          \`en\`,
          \`code\`
        ) VALUES (
          :cid,
          :bg,
          :en,
          :code
        )
      `, {
        cid: Number(item.cid),
        bg: item.bg,
        en: item.en,
        code: item.code,
      });
    }
  }

  async mainActivityList(): Promise<any[]> {
    const db = await this.getDb();

    const stm = <any>await db.execute(`
      SELECT
        *
      FROM
        \`companyGuruMainActivity\`
      ORDER BY
        \`code\`
    `);

    return stm?.[0];
  }

  async cacheRequestGet(hash: string): Promise<any | null> {
    const db = await this.getDb();

    const stm = <any>await db.execute(`
      SELECT
        *
      FROM
        \`_companyGuruCacheRequest\`
      WHERE
        \`hash\` = :hash
      LIMIT 1
    `, {
      hash,
    });

    return stm?.[0]?.[0];
  }

  async cacheRequestAdd(hash: string, response: any): Promise<void> {
    const db = await this.getDb();

    await db.execute(`
      INSERT INTO
        \`_companyGuruCacheRequest\`
      (
        \`hash\`,
        \`response\`
      ) VALUES (
        :hash,
        :response
      )
    `, {
      hash: hash,
      response: JSON.stringify(response),
    });
  }

  async cacheContinuesGet(key: string): Promise<any | null> {
    const db = await this.getDb();

    const stm = <any>await db.execute(`
      SELECT
        *
      FROM
        \`_companyGuruCacheContinues\`
      WHERE
        \`key\` = :key
      LIMIT 1
    `, {
      key: key,
    });

    return stm?.[0]?.[0];
  }

  async cacheContinuesAdd(key: string, date: string): Promise<void> {
    const db = await this.getDb();

    await db.execute(`
      INSERT INTO
        \`_companyGuruCacheContinues\`
      (
        \`key\`,
        \`date\`
      ) VALUES (
        :key,
        :date
      )
    `, {
      key: key,
      date: date,
    });
  }

  async companyDataGet(companyId: string): Promise<any> {
    const db = await this.getDb();

    const stm = <any>await db.execute(`
      SELECT
        *
      FROM
        \`companyGuruCompaniesData\`
      WHERE
        \`companyId\` = :companyId
      LIMIT 1
    `, {
      companyId,
    });

    const rs = stm?.[0]?.[0];

    return rs?.data || null;
  }

  async companyDataSet(companyId: string, data: any): Promise<void> {
    const db = await this.getDb();

    let existingCompany = await this.companyDataGet(companyId);

    if (existingCompany) {
      data = {
        ...existingCompany,
        ...data,
      };

      if (this.isEqual(data, existingCompany)) {
        return;
      }

      await db.execute(`
        UPDATE
          \`companyGuruCompaniesData\`
        SET
          \`data\` = :data
        WHERE
          \`companyId\` = :companyId
      `, {
        companyId,
        data: JSON.stringify(data),
      });
    } else {
      await db.execute(`
        INSERT INTO
          \`companyGuruCompaniesData\`
        (
          \`companyId\`,
          \`data\`
        ) VALUES (
          :companyId,
          :data
        )
      `, {
        companyId,
        data: JSON.stringify(data),
      });
    }
  }

  async getWaitingCompany(): Promise<any> {
    const db = await this.getDb();

    const stm = <any>await db.execute(`
        SELECT
          \`companyId\`,
          \`data\`
        FROM
          \`companyGuruCompaniesData\`
        WHERE
          \`data\`->>'$.status.cid' = 1
          AND \`companyId\` NOT IN (SELECT \`companyId\` FROM \`companyGuruCompanies\`)
        ORDER BY
          \`companyId\` DESC
        LIMIT 1
    `);

    return stm?.[0]?.[0];
  }

  async companyAdd(companyId: string, data: any): Promise<void> {
    const db = await this.getDb();

    await db.execute(`
      INSERT INTO
        \`companyGuruCompanies\`
      SET
        \`companyId\` = :companyId,
        \`data\` = :data
    `, {
      companyId,
      data,
    });
  }

  protected async getDb(): Promise<mysql.Connection> {
    if (!this.conn) {
      this.conn = await mysql.createConnection({
        namedPlaceholders: true,
        host: config.mysql.host,
        port: config.mysql.port,
        database: config.mysql.database,
        user: config.mysql.username,
        password: config.mysql.password,
      });

      // Cache
      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`_companyGuruCacheRequest\`  (
          \`hash\` varchar(50) NOT NULL,
          \`response\` json NOT NULL,
          PRIMARY KEY (\`hash\`)
        );
      `);

      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`_companyGuruCacheContinues\`  (
          \`key\` varchar(100) NOT NULL,
          \`date\` date NOT NULL,
          PRIMARY KEY (\`key\`)
        );
      `);

      // Companies
      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`companyGuruCompaniesData\`  (
          \`companyId\` varchar(100) NOT NULL,
          \`data\` json NULL,
          PRIMARY KEY (\`companyId\`)
        );
      `);

      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`companyGuruMainActivity\`  (
          \`cid\` int NOT NULL,
          \`bg\` varchar(100) NOT NULL,
          \`en\` varchar(100) NOT NULL,
          \`code\` varchar(100) NOT NULL,
          PRIMARY KEY (\`cid\`)
        );
      `);

      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`companyGuruCompanies\`  (
          \`companyId\` varchar(100) NOT NULL,
          \`data\` json NULL,
          PRIMARY KEY (\`companyId\`)
        );
      `);
    }

    return this.conn;
  }

  protected isEqual(objA: any, objB: any) {
    const a = JSON.stringify(objA);
    const b = JSON.stringify(objB);

    return a == b;
  }
}
