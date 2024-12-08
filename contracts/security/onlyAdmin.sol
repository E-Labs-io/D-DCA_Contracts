// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
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
abstract contract OnlyAdmin is Ownable {
    /**
     * @notice Mapping of admin access addresses
     */
    mapping(address => bool) private _admins;

    /**
     * @notice Modifier to check if the caller is an admin
     */
    modifier onlyAdmins() {
        require(
            _admins[_msgSender()] || (_msgSender() == owner()),
            "OnlyAdmin : [onlyAdmins] Address is not an admin"
        );
        _;
    }

    /**
     * @notice Adds an admin to the contract
     * @param newAdmin_ The address to add as an admin
     */
    function addAdmin(address newAdmin_) public onlyOwner {
        _admins[newAdmin_] = true;
    }

    /**
     * @notice Removes an admin from the contract
     * @param oldAdmin_ The address to remove as an admin
     */
    function removeAdmin(address oldAdmin_) public onlyOwner {
        _admins[oldAdmin_] = false;
    }

    /**
     * @notice Checks if an address is an admin
     * @param addressToCheck_ The address to check
     * @return True if the address is an admin, false otherwise
     */
    function checkIfAdmin(address addressToCheck_) public view returns (bool) {
        return _admins[addressToCheck_];
    }
}
