pragma solidity ^0.8.20;

library ReinvestCodes {
    uint8 constant NOT_ACTIVE = 0x00; 
    uint8 constant FORWARD = 0x01;
    uint8 constant CUSTOM = 0x03;

    uint8 constant COMPOUND_ETH = 0x11;

    uint8 constant AAVE_ETH = 0xa1;
    uint8 constant AAVE_BTC = 0xa2;

    uint8 constant HOP_ETH = 0xb1;

    uint8 constant POOLTOGETHER_ETH = 0xc1;

}
