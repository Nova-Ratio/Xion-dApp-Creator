import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';

export const getWalletData = async () => {
  try {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env.MNEMONIC as string,
      {
        prefix: 'xion',
      },
    );

    const accounts = await signer.getAccounts();

    const client = await SigningCosmWasmClient.connectWithSigner(
      'https://xion-test-priv-rpc.kingnodes.com/',
      signer,
      {
        gasPrice: GasPrice.fromString('0.025uxion'),
      },
    );

    return { signer, address: accounts[0].address, client };
  } catch (error) {
    console.error('Error getting wallet data:', error);
    throw new Error('Failed to get wallet data');
  }
};
