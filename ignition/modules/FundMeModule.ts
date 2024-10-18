import { buildModule } from "@nomicfoundation/ignition-core";

const FundMeModule = buildModule("FundMeModule", (module) => {
    const AggregatorV3Sepolia = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    const fundMe = module.contract("FundMe", [AggregatorV3Sepolia]);

    return {
        fundMe
    }
})

export default FundMeModule