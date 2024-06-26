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

  console.log('Cw721-Staking code id: ', codeId);
  const { address, client } = await getWalletData();

  const nftCodeId = 672;
  const nftInstantiateMsg = {
    minter: address,
    name: 'Token',
    symbol: 'TOKEN',
  };
  const nftInstantiateResponse = await client.instantiate(
    address,
    nftCodeId,
    nftInstantiateMsg,
    'NFT',
    'auto',
  );
  const nftcontractAddress = nftInstantiateResponse.contractAddress;
  const nftcontractAddressFilePath = path.resolve(
    getDirname(import.meta.url),
    './nftcontractAddress.json',
  );
  fs.writeFileSync(
    nftcontractAddressFilePath,
    JSON.stringify({ nftcontractAddress }),
    'utf8',
  );

  const cw721_staking_data = await client.instantiate(
    address,
    codeId,
    {
      admin: address,
      nft_addr: nftcontractAddress,
    },
    'Cw721 Staking',
    'auto',
    {
      admin: address,
    },
  );

  const contractAddress = cw721_staking_data.contractAddress;
  console.log('Cw721-Staking Address: ', contractAddress);

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
