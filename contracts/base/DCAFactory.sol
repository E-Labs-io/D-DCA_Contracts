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

    /**
     * @dev The swap router address
     * @return The swap router address
     */
    address public immutable SWAP_ROUTER;

    /**
     * @dev The executor address
     */
    address private _executorAddress;

    /**
     * @dev The reinvest logic contract address
     * @return The reinvest logic contract address
     */
    address public reInvestLogicContract;

    /**
     * @dev The total deployed accounts
     * @return The total deployed accounts
     */
    uint256 public accountsCreated;

    /**
     * @dev Constructor for the DCAFactory
     * @param executorAddress_ The address of the executor
     * @param swapRouter_ The address of the swap router
     * @param reinvestLibraryContract_ The address of the reinvest library contract
     */
    constructor(
        address executorAddress_,
        address swapRouter_,
        address reinvestLibraryContract_
    ) Ownable(_msgSender()) {
        SWAP_ROUTER = swapRouter_;
        _executorAddress = executorAddress_;
        reInvestLogicContract = reinvestLibraryContract_;
    }

    /**
     * @dev Fallback function to revert any incoming calls
     * @notice NO FUNDS TO GO TO FACTORY
     */
    fallback() external payable {
        revert("DCAFactory : [fallback]");
    }

    /**
     * @dev Receive function to revert any incoming calls
     * @notice NO FUNDS TO GO TO FACTORY
     */
    receive() external payable {
        revert("DCAFactory : [receive]");
    }

    /**
     * @dev Creates a new DCAAccount
     * @notice Will create a new DCAAccount with the sender as the initial owner.
     */
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

    /**
     * @dev Gets all DCAAccounts created by a user
     * @param _user The address of the user
     * @return The addresses of the DCAAccounts created by the user
     */
    function getDCAAccountsOfUser(
        address _user
    ) external view returns (address[] memory) {
        return userDCAAccounts[_user];
    }

    /**
     * @dev Updates the executor address
     * @param _newExecutorAddress The address of the new executor
     */
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

    /**
     * @dev Updates the reinvest library address
     * @param newAddress_ The address of the new reinvest library
     */
    function updateReinvestLibraryAddress(
        address newAddress_
    ) public onlyOwner {
        reInvestLogicContract = newAddress_;
        emit ReinvestLibraryChanged(newAddress_);
    }

    /**
     * @dev Gets the active state of the factory
     * @return The active state of the factory
     */
    function getFactoryActiveState() public view returns (bool) {
        return _getActiveState();
    }

    /**
     * @dev Gets the executor address
     * @return The executor address
     */
    function getActiveExecutorAddress() public view returns (address) {
        return _executorAddress;
    }

    /**
     * @dev Gets the total deployed accounts
     * @return The total deployed accounts
     */
    function getTotalDeployedAccounts() public view returns (uint256) {
        return accountsCreated;
    }
}
