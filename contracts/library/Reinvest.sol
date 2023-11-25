// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library DCAReinvest {
    struct Reinvest {
        bool active;
        uint256 investCode;
        bytes depositReinvestMethod;
        bytes withdrawReinvestMethod;
        address reinvestSpender; // Address of the contract that needs approval to spend (protocol entry contract)
    }

    /**
     * @notice Addresses for Arbitrum Goerli network
     */

    address constant AAVE_CONTRACT = 0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c;

    function _executeInvest(
        Reinvest memory reinvestData_,
        address baseToken_,
        uint256 amount_
    ) internal returns (uint256) {}

    function executeWithdraw(
        Reinvest memory reinvestData_,
        address baseToken_,
        uint256 amount_
    ) internal returns (uint256) {}

    function _customReinvest(
        Reinvest memory reinvestData_,
        address baseToken_,
        uint256 amount_
    ) internal returns (uint256) {}

    function _predefinedReinvest() internal returns (uint256) {}
}
