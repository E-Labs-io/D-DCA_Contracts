// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
//DEV
import "hardhat/console.sol";
import {ReinvestCodes} from "../library/Codes.sol";
import {DCAReinvestLogic, IDCADataStructures} from "../logic/ReinvestLogic.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/Proxy.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/draft-IERC1822.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
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
abstract contract DCAReinvestProxy is
    Initializable,
    DCAReinvestLogic,
    OwnableUpgradeable
{
    function initialize(bool activate_) public initializer {
        __Ownable_init(msg.sender);
    }

    function executeReinvest(
        IDCADataStructures.Reinvest memory reinvestData_,
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
        IDCADataStructures.Reinvest memory reinvestData_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeWithdraw(reinvestData_, amount_);
    }

    function migrateReinvest(
        IDCADataStructures.Reinvest memory oldReinvestData_,
        IDCADataStructures.Reinvest memory newReinvestData_,
        bool withdrawFunds_
    ) external returns (uint256 amount, bool success) {
        return (amount, success);
    }

    function getLibraryVersion() public pure returns (string memory) {
        return REINVEST_VERSION;
    }
}
