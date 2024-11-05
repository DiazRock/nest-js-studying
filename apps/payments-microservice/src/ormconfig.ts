// src/ormconfig.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { Payment } from './typeorm/entities/Payments';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const config: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Payment],
  synchronize: true, // Disable in production
  logging: false,
};

export default config;