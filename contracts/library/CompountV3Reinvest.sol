pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../protocols/compoundV3/Comet.sol";
import {ReinvestCodes} from "./Codes.sol";

library CompoundV3Reinvest {
    address internal constant COMPOUND_USDC_CONTRACT =
        0x1d573274E19174260c5aCE3f2251598959d24456;
    address internal constant COMPOUND_ETH_CONTRACT =
        0x1d573274E19174260c5aCE3f2251598959d24456;

    function _supplyCompound(
        uint8 code_,
        uint256 amount_,
        address tokenAddress_
    ) internal returns (uint256 amount) {
        if (code_ == ReinvestCodes.COMPOUND_USDC) {
            // Approve the reinvest contract to spend the given token.
            bool allowed = IERC20(tokenAddress_).approve(
                COMPOUND_USDC_CONTRACT,
                amount_
            );

            require(
                allowed,
                "DCAAccount : [Compound Reinvest] - Approval failed"
            );

            // If it worked, then supply that token
            amount = Comet(COMPOUND_USDC_CONTRACT).supply(
                tokenAddress_,
                amount_
            );

            return amount;
        } else if (code_ == ReinvestCodes.COMPOUND_ETH) {
            // Approve the reinvest contract to spend the given token.
            bool allowed = IERC20(tokenAddress_).approve(
                COMPOUND_ETH_CONTRACT,
                amount_
            );

            require(
                allowed,
                "DCAAccount : [Compound Reinvest] - Approval failed"
            );

            // If it worked, then supply that token
            amount = Comet(COMPOUND_ETH_CONTRACT).supply(
                tokenAddress_,
                amount_
            );

            return amount;
        }
    }

    function _withdrawCompound(
        uint8 code_,
        uint256 amount_,
        address tokenAddress_
    ) internal returns (uint256 amount) {
        if (code_ == ReinvestCodes.COMPOUND_USDC) {
            // If it worked, then supply that token
            return
                Comet(COMPOUND_USDC_CONTRACT).withdraw(tokenAddress_, amount_);
        } else if (code_ == ReinvestCodes.COMPOUND_ETH) {
            return
                Comet(COMPOUND_ETH_CONTRACT).withdraw(tokenAddress_, amount_);
        }
    }

    


}
