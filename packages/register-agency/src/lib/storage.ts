import * as mysql from 'mysql2/promise';
import { config } from './config';

export class Storage {
  protected conn: mysql.Connection | null = null;

  async parsedFileAdd(fileName: string): Promise<void> {
    const db = await this.getDb();

    await db.execute(`
      INSERT INTO
        \`registerAgencyParsedFiles\`
      SET
        \`fileName\` = :fileName
    `, {
      fileName,
    });
  }

  async parsedFileGet(fileName: string): Promise<any> {
    const db = await this.getDb();

    const stm = <any>await db.execute(`
      SELECT
        *
      FROM
        \`registerAgencyParsedFiles\`
      WHERE
        \`fileName\` = :fileName
      LIMIT 1
    `, {
      fileName,
    });

    const rs = stm?.[0]?.[0];

    return rs || null;
  }

  async companyAppend(company: any): Promise<void> {
    const db = await this.getDb();

    await db.execute(`
      INSERT INTO registerAgencyCompanies (uic, data)
      VALUES (:uic, :data)
      ON DUPLICATE KEY UPDATE
      data = VALUES(data);
      -- data = JSON_MERGE_PRESERVE(data, VALUES(data));
    `, {
      uic: company.uic,
      data: JSON.stringify(company.data),
    });
  }

  async companyAdd(company: any): Promise<void> {
    const db = await this.getDb();

    await db.execute(`
        INSERT INTO
          \`registerAgencyCompanies\`
        (
          \`uic\`,
          \`data\`
        ) VALUES (
          :uic,
          :data
        )
      `, {
      uic: company.uic,
      data: JSON.stringify(company.data),
    });
  }

  async companyGet(uic: string): Promise<any> {
    const db = await this.getDb();

    const stm = <any>await db.execute(`
      SELECT
        *
      FROM
        \`registerAgencyCompanies\`
      WHERE
        \`uic\` = :uic
      LIMIT 1
    `, {
      uic,
    });

    const rs = stm?.[0]?.[0];

    return rs || null;
  }

  async companyDataSet(uic: string, data: []): Promise<any> {
    const db = await this.getDb();

    await db.execute(`
        UPDATE
          \`registerAgencyCompanies\`
        SET
          \`data\` = :data
        WHERE
          \`uic\` = :uic
      `, {
      uic,
      data: JSON.stringify(data),
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

      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`registerAgencyParsedFiles\`  (
          \`fileName\` varchar(255) NOT NULL,
          \`dateAdded\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`fileName\`)
        );
    `);

      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`registerAgencyCompanies\`  (
          \`uic\` varchar(15) NOT NULL,
          \`data\` json NOT NULL,
          PRIMARY KEY (\`uic\`)
        );
    `);
    }

    return this.conn;
  }
}
