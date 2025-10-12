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

  async companyAdd(data: any): Promise<void> {
    const db = await this.getDb();

    await db.execute(`
        INSERT INTO
          \`registerAgencyCompanies\`
        (
          \`uic\`,
          \`deeds\`
        ) VALUES (
          :uic,
          :deeds
        )
      `, {
      uic: data.uic,
      deeds: JSON.stringify(data.deeds),
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

  async companyDeedSet(uic: string, deeds: []): Promise<any> {
    const db = await this.getDb();

    await db.execute(`
        UPDATE
          \`registerAgencyCompanies\`
        SET
          \`deeds\` = :deeds
        WHERE
          \`uic\` = :uic
      `, {
      uic,
      deeds: JSON.stringify(deeds),
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
          \`deeds\` json NOT NULL,
          PRIMARY KEY (\`uic\`)
        );
    `);
    }

    return this.conn;
  }
}
