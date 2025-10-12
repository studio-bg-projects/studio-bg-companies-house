import * as mysql from 'mysql2/promise';
import { config } from './config';

export class Storage {
  protected conn: mysql.Connection | null = null;

  async addParsedFile(file: string): Promise<void> {
    const db = await this.getDb();

    await db.execute(`
      INSERT INTO
        \`parsedXmls\`
      SET
        \`file\` = :file
    `, {
      file,
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
        CREATE TABLE IF NOT EXISTS \`_cacheRequest\`  (
          \`hash\` varchar(50) NOT NULL,
          \`response\` json NOT NULL,
          PRIMARY KEY (\`hash\`)
        );
      `);

      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`_cacheContinues\`  (
          \`key\` varchar(100) NOT NULL,
          \`date\` date NOT NULL,
          PRIMARY KEY (\`key\`)
        );
      `);

      // Companies
      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`guruCompanies\`  (
          \`companyId\` varchar(100) NOT NULL,
          \`data\` json NULL,
          PRIMARY KEY (\`companyId\`)
        );
      `);

      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`guruMainActivity\`  (
          \`cid\` int NOT NULL,
          \`bg\` varchar(100) NOT NULL,
          \`en\` varchar(100) NOT NULL,
          \`code\` varchar(100) NOT NULL,
          PRIMARY KEY (\`cid\`)
        );
      `);

      await this.conn.execute(`
        CREATE TABLE IF NOT EXISTS \`brraCompanies\`  (
          \`companyId\` varchar(100) NOT NULL,
          \`data\` json NULL,
          PRIMARY KEY (\`companyId\`)
        );
      `);
    }

    return this.conn;
  }
}
