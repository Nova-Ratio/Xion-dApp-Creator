import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import fs from 'fs';

// Function to read the WASM file
const readWasmFile = (path: string): Uint8Array => {
  return fs.readFileSync(path);
};

// Function to deploy the contract
export const deployContract = async (
  client: SigningCosmWasmClient,
  senderAddress: string,
  wasmPath: string,
) => {
  const wasm = readWasmFile(wasmPath);
  return await client.upload(senderAddress, wasm, 'auto');
};
