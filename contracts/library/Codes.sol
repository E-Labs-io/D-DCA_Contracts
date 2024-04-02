// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
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

    function checkCode(uint8 have_, uint8 want_) internal pure returns (bool) {
        return have_ == want_;
    }
}
