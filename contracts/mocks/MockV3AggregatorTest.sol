// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;
import "@chainlink/contracts/src/v0.8/tests/MockV3Aggregator.sol";

/**
 * @title FundMe
 * @author Jeftar Mascarenhas
 * @notice This contract is only to study. It should never be used in production.
 */
contract MockV3AggregatorTest is MockV3Aggregator {
    constructor(
        uint8 decimals,
        int256 initialAnswer
    ) MockV3Aggregator(decimals, initialAnswer) {}
}
