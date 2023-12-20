// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DCAAccount.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DCAFactory is Ownable {
    // Event to emit when a new DCAAccount is created.
    event DCAAccountCreated(address indexed owner, address indexed dcaAccount);
    event DCAExecutorAddressChanged(address indexed newAddress);
    event DCAFactoryPauseStateChange(bool indexed isPaused);

    // Mapping to keep track of accounts created by each user.
    mapping(address => address[]) public userDCAAccounts;

    address immutable SWAP_ROUTER;
    address private _executorAddress;

    bool private isPaused;

    modifier isFactoryPaused() {
        require(!isPaused, "DCAFactory : Factory is paused");
        _;
    }

    constructor(
        address executorAddress_,
        address swapRouter_
    ) Ownable(_msgSender()) {
        SWAP_ROUTER = swapRouter_;
        _executorAddress = executorAddress_;
    }

    fallback() external payable {
        revert();
    }

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable {
        revert();
    }

    // Function to create a new DCAAccount.
    function createDCAAccount() public isFactoryPaused {
        // Create a new DCAAccount with the sender as the initial owner.
        address sender = _msgSender();
        DCAAccount newAccount = new DCAAccount(
            _executorAddress,
            SWAP_ROUTER,
            sender
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

    function setFactoryPauseState() public onlyOwner {
        isPaused = !isPaused;
        emit DCAFactoryPauseStateChange(isPaused);
    }

    function getFactoryPauseState() public view returns (bool) {
        return isPaused;
    }
}
