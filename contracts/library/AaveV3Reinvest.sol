pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import {Pool} from "@aave/core-v3/contracts/protocol/pool/Pool.sol";
import {ReinvestCodes} from "./Codes.sol";

library AaveV3Reinvest {
    address constant AAVE_CONTRACT = 0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c;

    string public constant STRATEGY_NAME = "Aave V3 Reinvest";

    /**
     * @dev Supply token to Aave V3 protocol
     * @param code_ {uint8} reinvest action code (see ReinvestCodes library)
     * @param amount_ {uint256} amount of the underlining token to supply
     * @param tokenAddress_ {address} address of the underlining (target) token
     * @return amount {uint256} the amount of the aToken recived
     */
    function _supplyAave(
        uint8 code_,
        uint256 amount_,
        address tokenAddress_
    ) internal returns (uint256 amount) {
        uint256 oldBalance = _getBalance(tokenAddress_);

        // Approve the reinvest contract to spend the given token.
        // Check that the approval worked
        bool allowed = IERC20(tokenAddress_).approve(AAVE_CONTRACT, amount_);
        require(allowed, "DCAAccount : [Aave Reinvest] - Approval failed");

        // If it worked, then supply that token
        // Check that we have recieved some tokens.
        //Pool(AAVE_CONTRACT).supply(tokenAddress_, amount_, address(this), 0);
        amount = _getBalance(tokenAddress_) - (oldBalance);
        return amount;
    }

    /**
     * @dev Withdraw liquidity from Aave pool
     * @param code_ {uint8} reinvest action code (see ReinvestCodes library)
     * @param amount_ {uint256} amount of the underlining token to supply
     * @param tokenAddress_ {address} address of the underlining (target) token
     * @return amount {uint256} Amount of the underlining token returned
     */
    function _withdrawAave(
        uint8 code_,
        uint256 amount_,
        address tokenAddress_
    ) internal returns (uint256 amount) {
        uint256 oldBalance = IERC20(tokenAddress_).balanceOf(address(this));

        //Pool(AAVE_CONTRACT).withdraw(tokenAddress_, amount_, address(this));
        amount = oldBalance - (IERC20(tokenAddress_).balanceOf(address(this)));

        return (amount);
    }

    /**
     * @dev Get users aToken balance from pool
     * @param tokenAddress_ address of the aToken
     * @return amount {uint256} Amount of the aToken of the wallet
     */
    function _getBalance(
        address tokenAddress_
    ) internal returns (uint256 amount) {
        // NEEDS TO BE WRITTEN
        /*  return
            Pool(AAVE_CONTRACT).collateralBalanceOf(
                address(this),
                tokenAddress_
            ); */

        return 0;
    }
}
