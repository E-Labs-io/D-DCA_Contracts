// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
library ReinvestTemplate {
    string public constant MODULE_NAME = "Lido stETH";
    uint8 public constant MODULE_ID = 0x15;

    // Entry point for Lido staking & stETH Token
    address public constant LIDO_CONTRACT =
        0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af;

    /**
     * @notice Reinvest modal Data Template
     * @dev change for the needs of your reinvest modal
     * moduleCode - code for any sub commands needed in the reinvest
     * receiver - The reciever of the tokens
     * token - address of the token to reinvest
     */

    struct ReinvestDataStruct {
        uint8 moduleCode;
    }

    function _execute(
        uint256 amount_,
        bytes memory data_
    )
        internal
        returns (uint256 amount, bool success, address reinvestLiquidityToken)
    {
        // ReinvestDataStruct memory investData = _decodeData(data_);
        payable(LIDO_CONTRACT).transfer(amount_);
        return (amount, success, LIDO_CONTRACT);
    }

    function _unwind(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        // Currently only transfers stETH to withdrawer due to withdrawal delay
        // ReinvestDataStruct memory investData = _decodeData(data_);
        IERC20(LIDO_CONTRACT).transfer(msg.sender, amount_);
        return (amount_, true);
    }

    function _decodeData(
        bytes memory data_
    ) private pure returns (ReinvestDataStruct memory) {
        return abi.decode(data_, (ReinvestDataStruct));
    }
}
