require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.23",
  networks: {
    // We add this new network block
    ganache: {
      url: process.env.GANACHE_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1337 // or 5777, check your Ganache UI
    },
  },
};