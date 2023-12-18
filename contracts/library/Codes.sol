pragma solidity ^0.8.20;

library ReinvestCodes {
    uint8 constant NOT_ACTIVE = 0x00; 
    uint8 constant COMPOUND_USDC = 0x01;
    uint8 constant COMPOUND_ETH = 0x02;
    uint8 constant AAVE_ETH = 0xa1;
    uint8 constant AAVE_BTC = 0xa2;

    uint8 constant CUSTOM = 0xff;
}
