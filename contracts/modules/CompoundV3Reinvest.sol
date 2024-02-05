pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../protocols/compoundV3/CometMainInterface.sol";
import {ReinvestCodes} from "../library/Codes.sol";

library CompoundV3Reinvest {
  string public constant STRATEGY_NAME = "Compound V3 Reinvest";
 address internal constant COMPOUND_ETH_CONTRACT =
        0x1d573274E19174260c5aCE3f2251598959d24456;

  

    function _supplyCompound(
        uint8 code_,
        uint256 amount_,
        address tokenAddress_
    ) internal returns (uint256 amount) {
        address compoundContract = _getContractAddress(code_);
        uint256 oldBalance = _getBalance(tokenAddress_, compoundContract);

        // Approve the reinvest contract to spend the given token.
        // Check that the approval worked
        bool allowed = IERC20(tokenAddress_).approve(compoundContract, amount_);
        require(allowed, "DCAAccount : [Compound Reinvest] - Approval failed");

        // If it worked, then supply that token
        // Check that we have recieved some tokens.
        CometMainInterface(compoundContract).supply(tokenAddress_, amount_);
        amount = _getBalance(tokenAddress_, compoundContract) - (oldBalance);
        return amount;
    }

    function _withdrawCompound(
        uint8 code_,
        uint256 amount_,
        address tokenAddress_
    ) internal returns (uint256 amount) {
        address compoundContract = _getContractAddress(code_);
        uint256 oldBalance = _getBalance(tokenAddress_, compoundContract);

        CometMainInterface(compoundContract).withdraw(tokenAddress_, amount_);
        amount = oldBalance - (_getBalance(tokenAddress_, compoundContract));
        return (amount);
    }

    function _getContractAddress(uint8 code_) internal pure returns (address) {
 
    if (code_ == ReinvestCodes.COMPOUND_ETH)
            return COMPOUND_ETH_CONTRACT;
    }

    function _getBalance(
        address tokenAddress_,
        address pool_
    ) internal returns (uint256 amount) {
        amount = CometMainInterface(pool_).balanceOf(address(this));
    }
}
