// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ForwardReinvest} from "../modules/ForwardReinvest.sol";
import {AaveV3Reinvest} from "../modules/AaveV3Reinvest.sol";
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
library ReinvestCodes {
    uint8 constant NOT_ACTIVE = 0x00;
    uint8 constant FORWARD = 0x01;

    uint8 constant COMPOUND = 0x11;
    uint8 constant AAVE = 0x12;
    uint8 constant HOP = 0x13;
    uint8 constant POOLTOGETHER_ETH = 0x14;
    uint8 constant LIDO_STETH = 0x15;

    /**
     * @notice Checks if the have_ code matches the want_ code
     * @param have_ The code to check
     * @param want_ The code to compare against
     * @return True if the codes match, false otherwise
     */
    function checkCode(uint8 have_, uint8 want_) internal pure returns (bool) {
        return have_ == want_;
    }

    /**
     * @notice Returns the module name for the given code
     * @param code_ The code to get the module name for
     * @return moduleName The module name
     */
    function _getModuleName(
        uint8 code_
    ) internal pure returns (string memory moduleName) {
        if (checkCode(code_, ReinvestCodes.NOT_ACTIVE))
            moduleName = "Not Active";
        else if (checkCode(code_, ReinvestCodes.FORWARD))
            moduleName = ForwardReinvest.MODULE_NAME;
        else if (checkCode(code_, ReinvestCodes.AAVE))
            moduleName = AaveV3Reinvest.MODULE_NAME;
        else if (checkCode(code_, ReinvestCodes.LIDO_STETH))
            moduleName = AaveV3Reinvest.MODULE_NAME;
    }
}
