import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql2 from 'mysql2/promise';

const poolConnection = mysql2.createPool(process.env.DATABASE_URL as string);
export const db = drizzle(poolConnection);
