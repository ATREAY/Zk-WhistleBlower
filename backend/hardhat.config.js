require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_URL = process.env.ALCHEMY_URL; 

// 2. YOUR PRIVATE KEY (With 0x added!)
// I pasted the key you gave me, but added '0x' to the front.
const PRIVATE_KEY = "0xffec397b318dbe048d75b87686e1d2bd77b26c94bf6c028b4150736bc387eac9";

module.exports = {
  solidity: "0.8.23",
  networks: {
    // We add this new network block
    //ganache: {
    sepolia: {
      url: ALCHEMY_URL,
      accounts: [PRIVATE_KEY],
      //chainId: 1337 // or 5777, check your Ganache UI
    },
  },
};