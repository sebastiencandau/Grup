import * as dotenv from 'dotenv';

// Charge le .env seulement si DB_TYPE n'est pas défini
if (!process.env.DB_TYPE) {
  dotenv.config(); 
}

export const typeOrmConfig = {
  type: process.env.DB_TYPE as any,      // 'postgres'
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
