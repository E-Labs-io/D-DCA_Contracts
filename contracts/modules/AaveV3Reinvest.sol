// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//import {Pool} from "@aave/core-v3/contracts/protocol/pool/Pool.sol";
import {ReinvestCodes} from "../library/Codes.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {AaveIPool} from "../protocols/aaveV3/IPool.sol";

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
library AaveV3Reinvest {
    string public constant MODULE_NAME = "Aave V3 Reinvest";
    uint8 public constant MODULE_ID = 0x12;

    // Aave pool addresses by chain - should be configurable per deployment
    address constant AAVE_POOL_BASE = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5;
    address constant AAVE_POOL_ETH = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
    address constant AAVE_POOL_ARB = 0x794a61358D6845594F94dc1DB02A252b5b4814aD;

    /**
     * @dev Gets the Aave pool contract for the current network
     * @param networkId The chain ID
     * @return The Aave pool contract
     */
    function _getAavePool(uint256 networkId) internal pure returns (AaveIPool) {
        if (networkId == 8453) return AaveIPool(AAVE_POOL_BASE); // Base
        if (networkId == 1) return AaveIPool(AAVE_POOL_ETH); // Ethereum
        if (networkId == 42161) return AaveIPool(AAVE_POOL_ARB); // Arbitrum
        // Default to Base for now
        return AaveIPool(AAVE_POOL_BASE);
    }

    /**
     * @dev The reinvest data structure
     *
     */
    struct ReinvestDataStruct {
        uint8 moduleCode; // Module code
        address token; // Underlying token
        address aToken; // aToken address
        address pool; // Aave pool address for the network
    }

    /**
     * @dev Executes the reinvest logic
     * @param amount_ The amount of tokens to reinvest
     * @param data_ The encoded reinvest data
     * @return amount The amount of tokens reinvested
     * @return success A boolean indicating success
     */
    function _execute(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);
        AaveIPool pool = AaveIPool(investData.pool);

        uint256 oldBalance = IERC20(investData.aToken).balanceOf(address(this));

        bool approvalSuccess = IERC20(investData.token).approve(
            address(pool),
            amount_
        );

        if (approvalSuccess) {
            pool.supply(investData.token, amount_, address(this), 0);

            uint256 newBalance = IERC20(investData.aToken).balanceOf(
                address(this)
            );

            amount = newBalance - oldBalance;
            success = amount > 0;
        }

        return (amount, success);
    }

    /**
     * @dev Unwinds the reinvest logic
     * @param amount_ The amount of tokens to unwind
     * @param data_ The encoded unwind data
     * @return amount The amount of tokens unwound
     * @return success A boolean indicating success
     */
    function _unwind(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);
        AaveIPool pool = AaveIPool(investData.pool);
        amount = pool.withdraw(investData.token, amount_, address(this));

        success = amount > 0;
        return (amount, success);
    }

    /**
     * @dev Decodes the reinvest data
     * @param data_ The encoded reinvest data
     * @return The reinvest data structure
     */
    function _decodeData(
        bytes memory data_
    ) private pure returns (ReinvestDataStruct memory) {
        return abi.decode(data_, (ReinvestDataStruct));
    }
}
