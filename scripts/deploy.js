const hre = require("hardhat");
async function main() {
  const { WOOLF_ADDRESS } = process.env;
  const NFT = await hre.ethers.getContractFactory("WolfBug");
  const nft = await NFT.deploy();   //CONTRACT INFO
  await nft.deployed();

  const contract = NFT.attach(nft.address);
  await contract.setContract(WOOLF_ADDRESS);
  console.log("Contract deployed to:", nft.address);
}
main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
