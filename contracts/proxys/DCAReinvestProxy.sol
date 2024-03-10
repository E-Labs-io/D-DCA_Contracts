// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
//DEV
import "hardhat/console.sol";
import {ReinvestCodes} from "../library/Codes.sol";
import {DCAReinvestLogic} from "../utils/reinvestLogic.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/Proxy.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/draft-IERC1822.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract DCAReinvestProxy is
    Initializable,
    DCAReinvestLogic,
    OwnableUpgradeable
{
    bool public REINVEST_ACTIVE;

    function initialize(bool activate_) public initializer {
        REINVEST_ACTIVE = activate_;
        __Ownable_init(msg.sender);
    }

    function executeReinvest(
        Reinvest memory reinvestData_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeInvest(reinvestData_, amount_);
    }
    event TestCall();
    function testCall() external returns (uint256, bool) {
        (uint256 amount, bool success) = (420, true);
        emit TestCall();
        return (amount, success);
    }
    function unwindReinvest(
        Reinvest memory reinvestData_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeWithdraw(reinvestData_, amount_);
    }

    function migrateReinvest(
        Reinvest memory oldReinvestData_,
        Reinvest memory newReinvestData_,
        bool withdrawFunds_
    ) external returns (uint256 amount, bool success) {
        return (amount, success);
    }

    function getLibraryVersion() public pure returns (string memory) {
        return REINVEST_VERSION;
    }

    function setActiveState() public onlyOwner {
        REINVEST_ACTIVE = !REINVEST_ACTIVE;
    }
}
