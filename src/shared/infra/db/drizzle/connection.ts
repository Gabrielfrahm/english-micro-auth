import * as dotenv from 'dotenv';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
dotenv.config();
import { Client } from 'pg';

// export const databaseSingleton = async (): Promise<NodePgDatabase> => {
//   const client = new Client({
//     connectionString: process.env.DATABASE_URL,
//   });

//   await client.connect();

//   const db = drizzle(client, { schema: {} });

//   await migrate(db, {
//     migrationsFolder: './src/shared/infra/db/drizzle/migrations',
//   });

//   return db;
// };

export class Connection {
  static connection: NodePgDatabase = null;
  static connectionDriver = null;
  static async getConnection(): Promise<NodePgDatabase> {
    if (!this.connection && !this.connectionDriver) {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
      });

      await client.connect();
      const db = drizzle(client, { schema: {} });

      await migrate(db, {
        migrationsFolder: './src/shared/infra/db/drizzle/migrations',
      });

      this.connection = db;
      this.connectionDriver = client;
    }
    return this.connection;
  }
}
