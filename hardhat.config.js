require('@nomiclabs/hardhat-ethers');


module.exports = {
  solidity: '0.8.27',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/fd1290bfd4c14d04a102532420711035",
      accounts: ["0x38ae29dc69c58267283344fe6871bc47540a812beefbf4e913d0196d28ba347d"], 
      chainId: 11155111,
    },
  },
  paths: {
    artifacts: './client/src/artifacts',
  },
};
