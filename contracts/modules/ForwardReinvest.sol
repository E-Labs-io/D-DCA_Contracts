// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReinvestCodes} from "../library/Codes.sol";


library ForwardReinvest {
    string public constant STRATEGY_NAME = "Forward Reinvest V0.1";

    struct ReinvestDataStruct {
        address receiver;
        address token;
    }

    function _execute(uint8 code_,uint256 amount_, bytes memory data_) internal returns(uint256 , bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);
        success = IERC20(investData.token).transfer(investData.receiver, amount_);
        return (amount_, success);
    }
    
    function _unwind(uint8 code_,uint256 amount_, bytes memory data_)internal pure returns (uint256 amount, bool success){
        //  There isn't any investments to unwind in the forward
        return (0, true);
    }

    function _decodeData(bytes memory data_)private pure returns(ReinvestDataStruct memory){
    return abi.decode(data_,(ReinvestDataStruct));
}

    
}
