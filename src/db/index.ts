import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Invoice } from "./schema";
const pool = new Pool({ connectionString: process.env.XATA_DATA_ENDPOINT });
export const db = drizzle(pool,{
    schema:{
        Invoice
    }
});
