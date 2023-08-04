import { config as readEnv } from 'dotenv';
import { join } from 'path';

function makeConfig(envFile: string): { db: { connection: string } } {
  const output = readEnv({ path: envFile });

  return {
    db: {
      connection: output.parsed.DATABASE_URL,
    },
  };
}

const envTestingFile = join(__dirname, '../../../../.env.test');
export const configTest = makeConfig(envTestingFile);
