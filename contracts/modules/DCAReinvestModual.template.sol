// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReinvestCodes} from "../library/Codes.sol";

library ReinvestTemplate {
    string public constant STRATEGY_NAME = "ReinvestTemplate";

    struct ReinvestDataStruct {
        uint8 moduleCode;
        address receiver;
        address token;
    }

    function _execute(
        uint256 amount_,
        bytes memory data_
    )
        internal
        returns (uint256 amount, bool success, address reinvestLiquidityToken)
    {
        ReinvestDataStruct memory investData = _decodeData(data_);
        return (amount, success, address(0x0));
    }

    function _unwind(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);

        return (0, true);
    }

    function _decodeData(
        bytes memory data_
    ) private pure returns (ReinvestDataStruct memory) {
        return abi.decode(data_, (ReinvestDataStruct));
    }
}
