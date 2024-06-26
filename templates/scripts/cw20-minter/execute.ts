import { getWalletData } from '../utils/wallet';
import * as path from 'path';
import * as fs from 'fs';
import { getDirname } from '../utils/getDirname';

export default async function execute() {
  const contractAddressFilePath = path.resolve(
    getDirname(import.meta.url),
    './contractAddress.json',
  );
  let contractAddress: string;
  try {
    if (!fs.existsSync(contractAddressFilePath)) {
      throw new Error(
        'contractAddress.json file not found, please run instantiate.ts first',
      );
    }

    const fileContent = fs.readFileSync(contractAddressFilePath, 'utf8');

    if (!fileContent) {
      throw new Error(
        'contractAddress.json is empty, please run instantiate.ts first',
      );
    }

    const parsedContent = JSON.parse(fileContent);
    if (typeof parsedContent.contractAddress !== 'string') {
      throw new Error(
        'contractAddress.json file does not contain a valid contractAddress',
      );
    }
    contractAddress = parsedContent.contractAddress;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error reading contractAddress:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }

    process.exit(1);
  }

  const { address, client } = await getWalletData();

  const mint_Cw20_token = await client.execute(
    address,
    contractAddress,
    {
      mint_token: { to: address, amount: '1000000' },
    },
    'auto',
  );

  console.log('Token minted: ', mint_Cw20_token);
}
