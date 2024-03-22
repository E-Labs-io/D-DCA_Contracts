// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DCAAccount.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../security/onlyActive.sol";

contract DCAFactory is OnlyActive {
    // Event to emit when a new DCAAccount is created.
    event DCAAccountCreated(address indexed owner, address indexed dcaAccount);
    event DCAExecutorAddressChanged(address indexed newAddress);
    event DCAReinvestContractAddressChanged(address indexed newLibraryAddress);

    // Mapping to keep track of accounts created by each user.
    mapping(address => address[]) public userDCAAccounts;

    address public immutable SWAP_ROUTER;
    address private _executorAddress;
    address private _permit2Contract;
    address public reInvestLogicContract;

    constructor(
        address executorAddress_,
        address swapRouter_,
        address reinvestLibraryContract_,
        address permit2Contract_
    ) Ownable(_msgSender()) {
        SWAP_ROUTER = swapRouter_;
        _executorAddress = executorAddress_;
        reInvestLogicContract = reinvestLibraryContract_;
        _permit2Contract = permit2Contract_;
    }

    fallback() external payable {
        revert("DCAFactory : [fallback]");
    }

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable {
        revert("DCAFactory : [receive]");
    }

    // Function to create a new DCAAccount.
    function createDCAAccount() public is_active {
        // Create a new DCAAccount with the sender as the initial owner.
        address sender = _msgSender();
        DCAAccount newAccount = new DCAAccount(
            _executorAddress,
            SWAP_ROUTER,
            sender,
            reInvestLogicContract,
            _permit2Contract
        );

        // Store the new account's address in the mapping.
        userDCAAccounts[sender].push(address(newAccount));

        // Emit an event for the frontend to listen to.
        emit DCAAccountCreated(sender, address(newAccount));
    }

    // Function to get all DCAAccounts created by a user.
    function getDCAAccountsOfUser(
        address user
    ) public view returns (address[] memory) {
        return userDCAAccounts[user];
    }

    function updateExecutorAddress(
        address _newExecutorAddress
    ) public onlyOwner {
        require(
            _newExecutorAddress != _executorAddress,
            "DCAFactory: updateExecutorAddress - same address"
        );

        _executorAddress = _newExecutorAddress;
        emit DCAExecutorAddressChanged(_newExecutorAddress);
    }

    function updateReinvestLibraryAddress(
        address newAddress_
    ) public onlyOwner {
        reInvestLogicContract = newAddress_;
        emit DCAReinvestContractAddressChanged(newAddress_);
    }

    function getFactoryActiveState() public view returns (bool) {
        return _getActiveState();
    }

    function getActiveExecutorAddress() public view returns (address) {
        return _executorAddress;
    }
}
