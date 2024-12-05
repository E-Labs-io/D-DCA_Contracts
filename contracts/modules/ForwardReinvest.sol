// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
//DEV
import "hardhat/console.sol";
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
library ForwardReinvest {
    string public constant MODULE_NAME = "Forward Reinvest V0.2";
    uint8 public constant MODULE_ID = 0x01;

    struct ReinvestDataStruct {
        uint8 moduleCode;
        address receiver;
        address token;
    }

    function _execute(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);
        if (investData.token == address(0))
            (success, ) = payable(address(investData.receiver)).call{
                value: amount_
            }("");
        else
            success = IERC20(investData.token).transfer(
                investData.receiver,
                amount_
            );

        return (amount_, success);
    }

    function _unwind(
        uint256 amount_,
        bytes memory data_
    ) internal pure returns (uint256 amount, bool success) {
        //  There isn't any investments to unwind in the forward
        return (0, true);
    }

    function _decodeData(
        bytes memory data_
    ) private pure returns (ReinvestDataStruct memory) {
        return abi.decode(data_, (ReinvestDataStruct));
    }
}
