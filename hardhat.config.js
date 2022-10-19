require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-docgen");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    compilers: [{
      version: "0.7.6"
    },
    {
      version: "0.8.6"
    }]
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.BSC_MAINNET, 
        blockNumber: 22317907,
      }
    },
    bsc_testnet: {
      url: process.env.BSC_TESTNET,
      accounts:{
        mnemonic: process.env.MNEMONIC
      },
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSC_API_KEY,
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    token: "BNB",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};
