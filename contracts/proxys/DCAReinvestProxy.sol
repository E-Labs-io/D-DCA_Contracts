// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReinvestCodes} from "../library/Codes.sol";
import {ForwardReinvest} from "../modules/ForwardReinvest.sol";

import {DCAReinvest} from "../utils/DCAReinvest.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";



contract DCAReinvestProxy is  Initializable, DCAReinvest, OwnableUpgradeable {
    using ReinvestCodes for uint8;

    string public constant REINVEST_VERSION = "ETH_SEPOLIA V0.2";
    bool public REINVEST_ACTIVE;


    function initialize(bool activate_) public initializer {
        REINVEST_ACTIVE = activate_;
        __Ownable_init(msg.sender);
    }

    function executeReinvest(
        Reinvest memory reinvestData_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeInvest(reinvestData_,  amount_);
    }

    function unwindReinvest(
        Reinvest memory reinvestData_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeWithdraw(reinvestData_,  amount_);
    }

    function migrateReinvest(Reinvest memory oldReinvestData_,Reinvest memory newReinvestData_, bool withdrawFunds_) external returns (uint256 amount, bool success) {

    }

    function getLibraryVersion() public pure returns (string memory) {
        return REINVEST_VERSION;
    }

    function setActiveState() public onlyOwner {
        REINVEST_ACTIVE = !REINVEST_ACTIVE;
    }
}
