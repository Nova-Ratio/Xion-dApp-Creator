import { getWalletData } from '../utils/wallet';
import * as path from 'path';
import * as fs from 'fs';
import { getDirname } from '../utils/getDirname';

export default async function query() {
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

  const nftcontractAddressFilePath = path.resolve(
    getDirname(import.meta.url),
    './nftcontractAddress.json',
  );
  let nftcontractAddress: string;
  try {
    if (!fs.existsSync(nftcontractAddressFilePath)) {
      throw new Error(
        'nftcontractAddress.json file not found, please run instantiate.ts first',
      );
    }

    const fileContent = fs.readFileSync(nftcontractAddressFilePath, 'utf8');

    if (!fileContent) {
      throw new Error(
        'nftcontractAddress.json is empty, please run instantiate.ts first',
      );
    }

    const parsedContent = JSON.parse(fileContent);
    if (typeof parsedContent.nftcontractAddress !== 'string') {
      throw new Error(
        'nftcontractAddress.json file does not contain a valid contractAddress',
      );
    }
    nftcontractAddress = parsedContent.nftcontractAddress;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error reading nftcontractAddress:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }

    process.exit(1);
  }

  const { address, client } = await getWalletData();

  // query token response
  const TokensResponse = await client.queryContractSmart(nftcontractAddress, {
    tokens: { owner: address },
  });
  console.log(TokensResponse);

  // query collection
  const queryCollection = await client.queryContractSmart(contractAddress, {
    whitelisted_nft_addresses: {},
  });
  console.log(queryCollection);

  // query stakings
  const queryStaking = await client.queryContractSmart(contractAddress, {
    stakings_by_address: { address: address },
  });
  console.log(queryStaking);

  // query admin
  const queryAdmin = await client.queryContractSmart(contractAddress, {
    admin_address: {},
  });
  console.log(queryAdmin);
}
