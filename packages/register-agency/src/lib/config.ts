import dotenv from 'dotenv';

dotenv.config({
  path: __dirname + '/../../../../.env',
});

export const config = {
  mysql: {
    host: process.env.DB_MAIN_HOST || '127.0.0.1',
    port: parseInt(process.env.PORT_MYSQL_MAIN || '3306'),
    database: process.env.DB_MAIN_DATABASE || '',
    username: process.env.DB_MAIN_USERNAME || '',
    password: process.env.DB_MAIN_PASSWORD || '',
  },
};
