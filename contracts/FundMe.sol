// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PriceConverter.sol";

/**
 * @title FundMe
 * @author Jeftar Mascarenhas
 * @notice This contract is only to study. It should never be used in production.
 * This contract is based on Cyfrin Fund Me.
 */
contract FundMe is Ownable {
    // Using libary in type variable
    // using PriceConverter for uint256;

    // State Variables
    AggregatorV3Interface internal dataFeed;
    uint256 public constant MINIMAL_PRICE_USD = 5 * 10 ** 18;
    address[] private funders;
    mapping(address => uint256) private amountFundedPerAddress;

    error EtherNotEnough();
    event Funde(
        address indexed from,
        address indexed beneficiary,
        uint256 value
    );

    constructor(AggregatorV3Interface _dataFeed) Ownable(_msgSender()) {
        dataFeed = _dataFeed;
    }

    function fund() external payable {}

    function withdraw() external onlyOwner {}

    /**
     * Do it yourself
     */
    function cheaperWithdraw() external onlyOwner {}

    function getAmountFundedPerAddress(
        address funderAddress
    ) external view returns (uint256) {
        return amountFundedPerAddress[funderAddress];
    }

    function getVersion() external view returns (uint256) {
        return dataFeed.version();
    }

    function getFunder(uint256 index) external view returns (address) {
        return funders[index];
    }

    function getPriceFeed() external view returns (AggregatorV3Interface) {
        return dataFeed;
    }
}
