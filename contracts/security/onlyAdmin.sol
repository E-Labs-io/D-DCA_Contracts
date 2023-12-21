// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./onlyExecutor.sol";

abstract contract OnlyAdmin is OnlyExecutor {
    mapping(address => bool) private _admins;

    modifier onlyAdmins() {
        require(
            _admins[_msgSender()] || (_msgSender() == owner()),
            "OnlyAdmin : [onlyAdmins] Address is not an admin"
        );
        _;
    }

    function addAdmin(address newAdmin_) public onlyOwner {
        _admins[newAdmin_] = true;
    }

    function removeAdmin(address oldAdmin_) public onlyOwner {
        _admins[oldAdmin_] = false;
    }

    function checkIfAdmin(address addressToCheck_) public view returns (bool) {
        return _admins[addressToCheck_];
    }
}
