// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
 *                  V0.8
 *  x.com/0xAtion
 *  x.com/e_labs_
 *  e-labs.co.uk
 *
 */

library LidoStaking {
    string public constant MODULE_NAME = "Lido Staking";
    uint8 public constant MODULE_ID = 0x13;

    // Lido stETH contract addresses by chain
    address constant STETH_ETH = 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84;
    address constant WSTETH_ETH = 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0;

    /**
     * @dev The reinvest data structure for Lido staking
     */
    struct ReinvestDataStruct {
        uint8 moduleCode; // Module code
        address token; // Input token (should be ETH)
        address stEth; // stETH token address
        address wstEth; // wstETH token address (optional)
    }

    /**
     * @dev Executes Lido staking (ETH -> stETH)
     * @param amount_ The amount of ETH to stake
     * @param data_ The encoded reinvest data
     * @return amount The amount of stETH received
     * @return success Whether the staking was successful
     */
    function _execute(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);

        // For Lido, we need to send ETH directly to the stETH contract
        uint256 oldBalance = IERC20(investData.stEth).balanceOf(address(this));

        // Call stETH.submit with the amount of ETH to stake
        (bool callSuccess,) = investData.stEth.call{value: amount_}(
            abi.encodeWithSignature("submit(address)", address(this))
        );

        if (callSuccess) {
            uint256 newBalance = IERC20(investData.stEth).balanceOf(address(this));
            amount = newBalance - oldBalance;
            success = amount > 0;
        }

        return (amount, success);
    }

    /**
     * @dev Unwinds Lido staking (stETH -> ETH)
     * @param amount_ The amount of stETH to unstake
     * @param data_ The encoded unwind data
     * @return amount The amount of ETH received
     * @return success Whether the unstaking was successful
     */
    function _unwind(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);

        // Approve stETH for transfer to the contract
        bool approvalSuccess = IERC20(investData.stEth).approve(
            investData.stEth,
            amount_
        );

        if (approvalSuccess) {
            // Call unstake on stETH contract
            (bool callSuccess,) = investData.stEth.call(
                abi.encodeWithSignature("unwrap(uint256)", amount_)
            );

            if (callSuccess) {
                amount = amount_; // Should receive equivalent ETH
                success = true;
            }
        }

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