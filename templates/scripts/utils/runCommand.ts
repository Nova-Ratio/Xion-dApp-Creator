import * as path from 'path';
import { getDirname } from './getDirname';
import dotenv from 'dotenv';

dotenv.config();

const command = process.argv[2];
const contractName = process.argv[3];

if (!contractName || !command) {
  console.error('Usage: npm run <command> <contract-name>');
  process.exit(1);
}

const contractPath = path.resolve(
  getDirname(import.meta.url),
  '..',
  contractName,
  command + '.ts',
);

import(contractPath)
  .then((module) => {
    if (typeof module.default === 'function') {
      module.default();
    } else {
      console.error(`No default function exported from ${contractPath}`);
    }
  })
  .catch((error) => {
    console.error(`Failed to execute ${command} for ${contractName}:`, error);
  });
