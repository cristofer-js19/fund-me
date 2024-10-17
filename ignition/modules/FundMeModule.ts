import { buildModule } from "@nomicfoundation/ignition-core"

const FundMeModule = buildModule('FundMeModule', (module) => {
    const chainlinkAggregator = '0x694AA1769357215DE4FAC081bf1f309aDC325306'
    const fundMe = module.contract('FundMe', [chainlinkAggregator]);
    return { fundMe }
})

export default FundMeModule