// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DCAAccount.sol";

contract DCAAccountFactory {
    // Event to emit when a new DCAAccount is created.
    event DCAAccountCreated(address indexed owner, address dcaAccount);

    // Mapping to keep track of accounts created by each user.
    mapping(address => address[]) public userDCAAccounts;

    address immutable SWAP_ROUTER;
    address private _executorAddress;

    constructor(address executorAddress_, address swapRouter_) {
        SWAP_ROUTER = swapRouter_;
        _executorAddress = executorAddress_;
    }

    // Function to create a new DCAAccount.
    function createDCAAccount() public {
        // Create a new DCAAccount with the sender as the initial owner.
        DCAAccount newAccount = new DCAAccount(
            _executorAddress,
            SWAP_ROUTER,
            msg.sender
        );

        // Store the new account's address in the mapping.
        userDCAAccounts[msg.sender].push(address(newAccount));

        // Emit an event for the frontend to listen to.
        emit DCAAccountCreated(msg.sender, address(newAccount));
    }

    // Function to get all DCAAccounts created by a user.
    function getDCAAccountsOfUser(
        address user
    ) public view returns (address[] memory) {
        return userDCAAccounts[user];
    }
}
