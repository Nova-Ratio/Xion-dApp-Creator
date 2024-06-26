import { getWalletData } from '../utils/wallet';
import { deployContract } from '../utils/deploy';
import * as path from 'path';
import * as fs from 'fs';
import { getDirname } from '../utils/getDirname';

export default async function deploy() {
  const { address, client } = await getWalletData();

  const wasmPath = path.resolve(
    getDirname(import.meta.url),
    './../../contracts/cw20-minter/artifacts/cw20_minter.wasm',
  );

  const result = await deployContract(client, address, wasmPath);
  const codeId = result.codeId;
  console.log('Wasm deployed with codeId: ', codeId);

  const codeIdFilePath = path.resolve(
    getDirname(import.meta.url),
    './codeId.json',
  );
  fs.writeFileSync(codeIdFilePath, JSON.stringify({ codeId }), 'utf8');
}
