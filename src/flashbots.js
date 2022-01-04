require('dotenv').config();
const { providers, Wallet, BigNumber } = require('ethers')
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')
const { WOOLF_ADDRESS, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

const CHAIN_ID = 5;
const provider = new providers.InfuraProvider(CHAIN_ID)
const authSigner = new Wallet(
  PRIVATE_KEY,
  provider
);
const GWEI = BigNumber.from(10).pow(9)
const PRICE = BigNumber.from(10).pow(18);

async function main() {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    Wallet.createRandom(),
    "https://relay-goerli.flashbots.net"
  );

  provider.on('block', async (blockNumber) => {
    console.log(blockNumber);

    const signedTransactions = await flashbotsProvider.signBundle(
      [
        {
          signer: authSigner,
          transaction: {
            to: WOOLF_ADDRESS,
            chainId: CHAIN_ID,
            type: 2,
            value: PRICE.div(1000).mul(1),
            data: "0xee9ff07d0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000005c770a3f50ed8156c4a41bf7219b71676b14b46e",
            maxFeePerGas: GWEI.mul(5),
            maxPriorityFeePerGas: GWEI.mul(2)
          },
        },
        {
          signer: authSigner,
          transaction: {
            to: CONTRACT_ADDRESS,
            chainId: CHAIN_ID,
            type: 2,
            value: BigNumber.from(0),
            data: "0x919840ad",
            maxFeePerGas: GWEI.mul(5),
            maxPriorityFeePerGas: GWEI.mul(2)
          },
        },
      ]
    )

    flashbotsProvider.sendRawBundle(
      signedTransactions,
      blockNumber + 1
    )
  })
}

main().then().catch(error => {
  console.error(error);
});
