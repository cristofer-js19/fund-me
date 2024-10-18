import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: '',
      accounts: []
    },
  },
  etherscan: {
    apiKey: ""
  }
};

export default config;
