pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../protocols/compoundV3/CometMainInterface.sol";
import {ReinvestCodes} from "../library/Codes.sol";
/**
 *
 ************************************************
 *____ooo____oooooooo_oooo____oooo____ooo____oo_*
 *__oo___oo_____oo_____oo___oo____oo__oooo___oo_*
 *_oo_____oo____oo_____oo__oo______oo_oo_oo__oo_*
 *_ooooooooo____oo_____oo__oo______oo_oo__oo_oo_*
 *_oo_____oo____oo_____oo___oo____oo__oo___oooo_*
 *_oo_____oo____oo____oooo____oooo____oo____ooo_*
 *______________________________________________*
 *       Dollar Cost Average Contracts
 ************************************************
 *                  V0.6
 *  x.com/0xAtion
 *  x.com/e_labs_
 *  e-labs.co.uk
 *
 */
library CompoundV3Reinvest {
    string public constant STRATEGY_NAME = "Compound V3 Reinvest";
    address internal constant COMPOUND_ETH_CONTRACT =
        0x1d573274E19174260c5aCE3f2251598959d24456;

    uint8 constant WETH = 0x0;
    uint8 constant WBTC = 0x1;
    struct ReinvestDataStruct {
        uint8 moduleCode;
        address receiver;
        address token;
    }

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
        if (code_ == ReinvestCodes.COMPOUND) return COMPOUND_ETH_CONTRACT;
    }

    function _getBalance(
        address tokenAddress_,
        address pool_
    ) internal returns (uint256 amount) {
        amount = CometMainInterface(pool_).balanceOf(address(this));
    }
}
