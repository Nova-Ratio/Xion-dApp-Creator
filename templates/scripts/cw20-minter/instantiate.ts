import { getWalletData } from '../utils/wallet';
import * as path from 'path';
import * as fs from 'fs';
import { getDirname } from '../utils/getDirname';

export default async function instantiate() {
  const codeIdFilePath = path.resolve(
    getDirname(import.meta.url),
    './codeId.json',
  );
  let codeId: number;
  try {
    if (!fs.existsSync(codeIdFilePath)) {
      throw new Error('codeId.json file not found, please run deploy.ts first');
    }

    const fileContent = fs.readFileSync(codeIdFilePath, 'utf8');

    if (!fileContent) {
      throw new Error('codeId.json file is empty, please run deploy.ts first');
    }

    const parsedContent = JSON.parse(fileContent);
    if (typeof parsedContent.codeId !== 'number') {
      throw new Error('codeId.json file does not contain a valid codeId');
    }
    codeId = parsedContent.codeId;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error reading codeId:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }

    process.exit(1);
  }

  const { address, client } = await getWalletData();

  console.log('Cw20-Minter code id: ', codeId);

  const cw20_minter_data = await client.instantiate(
    address,
    codeId,
    {
      cw20_code_id: 641,
      decimals: 6,
      name: 'TOKEN',
      initial_balances: [],
      symbol: 'TKN',
    },
    'Cw20 Minter',
    'auto',
    {
      admin: address,
      funds: [],
      memo: '',
    },
  );

  const contractAddress = cw20_minter_data.contractAddress;
  console.log('Cw20-Minter address: ', contractAddress);

  const contractAddressFilePath = path.resolve(
    getDirname(import.meta.url),
    './contractAddress.json',
  );
  fs.writeFileSync(
    contractAddressFilePath,
    JSON.stringify({ contractAddress }),
    'utf8',
  );
}
