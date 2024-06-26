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

  const nftCodeId = 672;
  const nftInstantiateMsg = {
    minter: address,
    name: 'Token',
    symbol: 'TOKEN',
  };

  // Define the token ID and owner
  const tokenId = 'token_to_send';

  const metadata = {
    name: 'Token Name',
    description: 'Token Description',
  };

  // mint NFT first
  const mintResult = await client.execute(
    address,
    nftcontractAddress,
    { mint: { token_id: tokenId, extension: metadata, owner: address } },
    'auto',
  );

  console.log('NFT minted: ', mintResult.transactionHash, '\n');

  // send function directly triggers staking
  const stakeNft = await client.execute(
    address,
    nftcontractAddress,
    {
      send_nft: {
        contract: contractAddress,
        msg: '',
        token_id: 'token_to_send',
      },
    },
    'auto',
  );

  console.log('NFT staked: ', stakeNft.transactionHash, '\n');

  /*
  // index should start from 0
  const unstakeResult = await client.execute(
    address,
    contractAddress,
    { unstake: { index: 0 } },
    'auto',
  );
  
  
  // claim
  const claimResult = await client.execute(
    address,
    contractAddress,
    { claim: { index: 0 } },
    'auto',
  );
  */

  // admin can add nft addresses to whitelist
  // create second nft_address to add to whitelist
  const nftInstantiateResponse2 = await client.instantiate(
    address,
    nftCodeId,
    nftInstantiateMsg,
    'NFT 2',
    'auto',
  );
  const nftcontractAddress2 = nftInstantiateResponse2.contractAddress;
  console.log(
    'The Second NFT Address for admin to add to the collection: ',
    nftcontractAddress2,
    '\n',
  );

  // query collection before adding
  const queryCollectionBefore = await client.queryContractSmart(
    contractAddress,
    {
      whitelisted_nft_addresses: {},
    },
  );
  console.log(
    'Query collection before adding a new collection: ',
    queryCollectionBefore,
    '\n',
  );
  const addCollectionResult = await client.execute(
    address,
    contractAddress,
    { add_collection: { nft_addr: nftcontractAddress2 } },
    'auto',
  );

  console.log(
    'The new nft address added to the collection: ',
    addCollectionResult.transactionHash,
    '\n',
  );

  // query collection after
  const queryCollectionAfter = await client.queryContractSmart(
    contractAddress,
    {
      whitelisted_nft_addresses: {},
    },
  );
  console.log(
    'Query collection after adding a new collection: ',
    queryCollectionAfter,
    '\n',
  );

  const removeCollectionResult = await client.execute(
    address,
    contractAddress,
    { remove_collection: { nft_addr: nftcontractAddress2 } },
    'auto',
  );

  console.log(
    'Remove the added second NFT address frome the collection: ',
    removeCollectionResult.transactionHash,
    '\n',
  );
  // check if it is removed
  const queryCollectionRemoval = await client.queryContractSmart(
    contractAddress,
    { whitelisted_nft_addresses: {} },
  );
  console.log(
    'Check the collection after removal: ',
    queryCollectionRemoval,
    '\n',
  );

  // query stakings
  const queryStaking = await client.queryContractSmart(contractAddress, {
    stakings_by_address: { address: address },
  });
  console.log('Query the staking info: ', queryStaking, '\n');

  // query admin
  const queryAdmin = await client.queryContractSmart(contractAddress, {
    admin_address: {},
  });
  console.log('Query the admin of the staking contract :', queryAdmin, '\n');

  // Admin can burn the NFT
  const adminBurnResult = await client.execute(
    address,
    contractAddress,
    { admin_burn: { index: 0 } },
    'auto',
  );

  console.log(
    'Admin can burn the staked NFT :',
    adminBurnResult.transactionHash,
    '\n',
  );
}
