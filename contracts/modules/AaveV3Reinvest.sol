// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import {Pool} from "@aave/core-v3/contracts/protocol/pool/Pool.sol";
import {ReinvestCodes} from "../library/Codes.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IPool} from "../protocols/aaveV3/IPool.sol";

library AaveV3Reinvest {
    string public constant STRATEGY_NAME = "Aave V3 Reinvest";
    address constant AAVE_CONTRACT = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
    IPool constant AAVE_POOL = IPool(AAVE_CONTRACT);

    struct ReinvestDataStruct {
        uint8 moduleCode;
        address receiver;
        address token;
        address aToken;
    }

    function _execute(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);
        uint256 oldBalance = IERC20(investData.token).balanceOf(msg.sender);
        AAVE_POOL.deposit(investData.token, amount_, msg.sender, 0);
        amount = IERC20(investData.token).balanceOf(msg.sender) - oldBalance;
        success = amount > 0;
        return (amount, success);
    }

    function _unwind(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);
        amount = AAVE_POOL.withdraw(investData.token, amount_, msg.sender);
        success = amount > 0;
        return (amount, success);
    }

    function _decodeData(
        bytes memory data_
    ) private pure returns (ReinvestDataStruct memory) {
        return abi.decode(data_, (ReinvestDataStruct));
    }
}
