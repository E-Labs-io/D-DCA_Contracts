pragma solidity ^0.8.20;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/Proxy.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/draft-IERC1822.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract Called {
    bool public active = true;
    uint256 constant AMOUNT = 400;
    bool constant FLAG = true;

    event CallMeExecuted(uint256 amount, bool success);
    function callMe() external returns (uint256 amount, bool success) {
        (amount, success) = (AMOUNT + 20, FLAG);
        console.log("> CalledMe:", 20, amount, success);

        emit CallMeExecuted(amount, success);
        console.log("> CalledMe:", amount, success);
        return (amount, success);
    }
}

contract CalledProxy is Initializable, OwnableUpgradeable {
    bool public active;
    uint256 constant AMOUNT = 420;
    bool constant FLAG = true;

    function initialize(bool activate_) public initializer {
        active = activate_;
        __Ownable_init(msg.sender);
    }

    event CallMeExecuted(uint256, bool);
    /// @custom:oz-upgrades-unsafe-allow delegatecall
    function callMe() external returns (uint256 amount, bool success) {
        (amount, success) = (AMOUNT + 20, FLAG);
        console.log("> CalledMe:", 20, amount, success);

        emit CallMeExecuted(amount, success);
        console.log("> CalledMe:", amount, success);
        return (amount, success);
    }
}
