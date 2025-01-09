require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
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
  etherscan: {
    apiKey: {
      educhain: process.env.EDUCHAIN_API_KEY || "",
    },
    customChains: [
      {
        network: "educhain",
        chainId: 656476,
        urls: {
          apiURL:
            process.env.EDUCHAIN_API_URL ||
            "https://open-campus-codex.gelato.digital/api",
          browserURL:
            process.env.EDUCHAIN_EXPLORER ||
            "https://open-campus-codex.gelato.digital",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
