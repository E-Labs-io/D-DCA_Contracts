// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DCAAccount.sol";
import "../interfaces/IDCAFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../security/onlyActive.sol";
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
contract DCAFactory is OnlyActive, IDCAFactory, Ownable {
    // Mapping to keep track of accounts created by each user.
    mapping(address => address[]) public userDCAAccounts;

    address public immutable SWAP_ROUTER;
    address private _executorAddress;
    address public reInvestLogicContract;

    uint256 public accountsCreated;

    constructor(
        address executorAddress_,
        address swapRouter_,
        address reinvestLibraryContract_
    ) Ownable(_msgSender()) {
        SWAP_ROUTER = swapRouter_;
        _executorAddress = executorAddress_;
        reInvestLogicContract = reinvestLibraryContract_;
    }

    fallback() external payable {
        revert("DCAFactory : [fallback]");
    }

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable {
        revert("DCAFactory : [receive]");
    }

    // Function to create a new DCAAccount.
    function CreateAccount() public is_active {
        // Create a new DCAAccount with the sender as the initial owner.
        address sender = _msgSender();
        DCAAccount newAccount = new DCAAccount(
            _executorAddress,
            SWAP_ROUTER,
            sender,
            reInvestLogicContract
        );

        // Store the new account's address in the mapping.
        userDCAAccounts[sender].push(address(newAccount));

        // Emit an event for the frontend to listen to.
        emit AccountCreated(sender, address(newAccount));
        accountsCreated++;
    }

    // Function to get all DCAAccounts created by a user.
    function getDCAAccountsOfUser(
        address _user
    ) external view returns (address[] memory) {
        return userDCAAccounts[_user];
    }

    function updateExecutorAddress(
        address _newExecutorAddress
    ) public onlyOwner {
        require(
            _newExecutorAddress != _executorAddress,
            "DCAFactory: updateExecutorAddress - same address"
        );

        _executorAddress = _newExecutorAddress;
        emit ExecutorChanged(_newExecutorAddress);
    }

    function updateReinvestLibraryAddress(
        address newAddress_
    ) public onlyOwner {
        reInvestLogicContract = newAddress_;
        emit ReinvestLibraryChanged(newAddress_);
    }

    function getFactoryActiveState() public view returns (bool) {
        return _getActiveState();
    }

    function getActiveExecutorAddress() public view returns (address) {
        return _executorAddress;
    }

    function getTotalDeployedAccounts() public view returns (uint256) {
        return accountsCreated;
    }
}
