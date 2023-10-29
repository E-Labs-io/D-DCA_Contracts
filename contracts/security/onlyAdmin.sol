pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract OnlyAdmin is Ownable {
    mapping(address => bool) private _admins;

    modifier onlyAdmins() {
        require(
            _admins[_msgSender()] || (_msgSender() == owner()),
            "Address is not an admin"
        );
        _;
    }

    constructor() Ownable(address(msg.sender)) {}

    function addAdmin(address newAdmin_) public onlyOwner {
        _admins[newAdmin_] = true;
    }

    function removeAdmin(address oldAdmin_) public onlyOwner {
        _admins[oldAdmin_] = false;
    }

    function CheckIfAdmin(address addressToCheck_) public view returns (bool) {
        return _admins[addressToCheck_];
    }
}
