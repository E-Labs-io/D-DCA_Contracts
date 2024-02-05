// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../library/Codes.sol";
//import "../library/CompoundV3Reinvest.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";



contract DCAReinvestProxy is Initializable, OwnableUpgradeable {
    using ReinvestCodes for uint8;

    string public constant REINVEST_VERSION = "ETH_GOERLI V0.1";
    bool public REINVEST_ACTIVE;

    /**
     * @notice Reinvest strategy struct.
     * If no reinvest set active to false and zero-out other fields
     * If using predefined reinvest strategy zero-out the bytes fields
     * Check code agents the Reinvest Codes library
     *
     * @notice deposit & withdraw reinvest methods only needed IF using custom reinvest strategy
     *
     * @param active if reinvest is active for the strategy
     * @param investCode actionable code for predefined reinvest data
     * @param depositReinvestMethod encoded function for custom reinvest strategies
     * @param withdrawReinvestMethod encoded function for custom reinvest withdraw
     * @param reinvestSpender address of the reinvest interaction contract, contract that needs to spend the token
     */

    struct Reinvest {
        bool active;
        uint8 investCode;
        bytes depositReinvestMethod;
        bytes withdrawReinvestMethod;
        address reinvestSpender; // Address of the contract that needs approval to spend (protocol entry contract)
    }

    function initialize(bool activate_) public initializer {
        REINVEST_ACTIVE = activate_;
        __Ownable_init(msg.sender);
    }

    function executeReinvest(
        Reinvest memory reinvestData_,
        address tokenAddress_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeInvest(reinvestData_, tokenAddress_, amount_);
    }

    function unwindReinvest(
        Reinvest memory reinvestData_,
        address tokenAddress_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeWithdraw(reinvestData_, tokenAddress_, amount_);
    }

    /**
     *
     * @param reinvestData_ {Reinvest} Data of the reinvest strategy
     * @param tokenAddress_ {address} the underline token that will be reinvested (target token)
     * @param amount_ {uint256} amount of the token to be invested
     * @return amount {uint256} the amount of the yield baring token recived
     */

    function _executeInvest(
        Reinvest memory reinvestData_,
        address tokenAddress_,
        uint256 amount_
    ) internal returns (uint256 amount, bool success) {
        if (reinvestData_.investCode == ReinvestCodes.NOT_ACTIVE)
            return (amount, success);
        if (reinvestData_.investCode == ReinvestCodes.CUSTOM) {
            // execute the custom reinvest logic
            amount = _customReinvest(reinvestData_, tokenAddress_, amount_);
        } else if (reinvestData_.investCode <= ReinvestCodes.COMPOUND_ETH) {
            // pass to an execute Compound data
            /*   amount = CompoundV3Reinvest._supplyCompound(
                code_,
                amount_,
                tokenAddress_
            ); */
        } else if (reinvestData_.investCode <= ReinvestCodes.AAVE_ETH) {}

        if (amount > 0) {
            (success) = transferTokensToDCAAccount(
                tokenAddress_,
                amount,
                _msgSender()
            );
        }
    }

    function _executeWithdraw(
        Reinvest memory reinvestData_,
        address tokenAddress_,
        uint256 amount_
    ) internal returns (uint256 amount, bool success) {
        if (reinvestData_.investCode == ReinvestCodes.CUSTOM) {
            // execute the custom reinvest logic
            amount = _customReinvest(reinvestData_, tokenAddress_, amount_);
        } else if (reinvestData_.investCode <= ReinvestCodes.COMPOUND_ETH) {
            // pass to an execute Compound data
            /*      amount = CompoundV3Reinvest._supplyCompound(
                code_,
                amount_,
                tokenAddress_
            ); */
        } else if (reinvestData_.investCode <= ReinvestCodes.AAVE_ETH) {}
    }

    function transferTokensToDCAAccount(
        address tokenAddress_,
        uint256 amount_,
        address accountAddress_
    ) internal returns (bool success) {
        // Encoding the call to the transfer function of the ERC20 token
        bytes memory data = abi.encodeWithSignature(
            "transfer(address,uint256)",
            accountAddress_,
            amount_
        );

        // Low-level call to the token contract
        (success, ) = tokenAddress_.call(data);
        require(success, "Token transfer failed");

        return success;
    }

    function getLibraryVersion() public pure returns (string memory) {
        return REINVEST_VERSION;
    }

    function _customReinvest(
        Reinvest memory reinvestData_,
        address tokenAddress_,
        uint256 amount_
    ) internal returns (uint256 amount) {}

    function _customWithdraw() internal returns (uint256 amount) {}

    function setActiveState() public onlyOwner {
        REINVEST_ACTIVE = !REINVEST_ACTIVE;
    }
}
