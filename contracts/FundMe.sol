// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PriceConverter.sol";

import "hardhat/console.sol";

error EtherNotEnough();
error TransferFailure();
error InvalidDateForFunding();

contract FundMe is Ownable {
    // Using libary in type variable
    // using PriceConverter for uint256;

    // State Variables
    AggregatorV3Interface internal dataFeed;
    uint256 public constant MINIMAL_VALUE_USD = 5 * 10 ** 18;
    uint256 public deadline;
    address[] private funders;
    mapping(address => uint256) private amountFundedPerAddress;

    event Funde(
        address indexed from,
        address indexed beneficiary,
        uint256 value
    );

    constructor(AggregatorV3Interface _dataFeed, uint256 _contractValidityInDays) Ownable(_msgSender()) {
        dataFeed = _dataFeed;
        deadline = block.timestamp + (_contractValidityInDays * 1 days);
        // We can use console log in Solidity
        console.log("msg sender => ", _msgSender());
    }

    function fund() external payable {
        require(
            PriceConverter.getConversionRate(msg.value, dataFeed) >=
                MINIMAL_VALUE_USD,
            EtherNotEnough()
        );
        require(block.timestamp <= deadline, InvalidDateForFunding());

        amountFundedPerAddress[_msgSender()] += msg.value;
        funders.push(_msgSender());
        address beneficiary = owner();

        emit Funde(_msgSender(), beneficiary, msg.value);
    }

    function withdraw() external onlyOwner {
        for (uint i = 0; i < funders.length; i++) {
            address funder = funders[i];
            amountFundedPerAddress[funder] = 0;
        }

        funders = new address[](0);

        (bool success, ) = owner().call{value: address(this).balance}("");
        if (!success) {
            revert TransferFailure();
        }
    }

    /**
     * Do it yourself
     */
    function cheaperWithdraw() external onlyOwner {
        delete funders;
        
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, TransferFailure());
    }

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
