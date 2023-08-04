import { exec } from 'child_process';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import util from 'util';
dotenv.config({ path: '.env.test' });

export default async (): Promise<void> => {
  console.info('\nMontando suíte de testes...');

  const execSync = util.promisify(exec);

  global.__SCHEMA__ = `test_${crypto.randomUUID()}`;

  process.env.DATABASE_URL = `${process.env.DATABASE_URL}?schema=${global.__SCHEMA__}`;

  await execSync(
    `drizzle-kit push:pg --config=./src/shared/infra/db/drizzle/drizzle.config.ts`
  );

  console.info('Suíte pronta. Iniciando testes...\n');
};
