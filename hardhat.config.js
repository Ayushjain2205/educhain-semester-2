require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts/src", // Points to your Solidity contracts
    tests: "./test", // Points to the root test folder
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 656476,
    },
    educhain: {
      url:
        process.env.EDUCHAIN_RPC ||
        "https://rpc.open-campus-codex.gelato.digital",
      chainId: 656476,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
  },
};
