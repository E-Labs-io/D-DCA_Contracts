// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

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
interface IDCAFactory {
    /**
     * @notice Emitted when a new DCAAccount is created.
     * @param owner The owner of the DCAAccount
     * @param dcaAccount The address of the DCAAccount
     */
    event AccountCreated(address indexed owner, address indexed dcaAccount);

    /**
     * @notice Emitted when the DCAExecutor address is changed.
     * @param newAddress The new address of the DCAExecutor
     */
    event ExecutorChanged(address indexed newAddress);
    /**
     * @notice Emitted when the DCAReinvestContract address is changed.
     * @param newLibraryAddress The new address of the DCAReinvestContract
     */
    event ReinvestLibraryChanged(address indexed newLibraryAddress);

    /**
     * @notice Creates a new DCAAccount to belong to the caller.
     * @notice Emits a DCAAccountCreated event.
     * @dev Access control is handled by the OnlyActive inheritance.
     */
    function CreateAccount() external;

    /**
     * @notice Returns all DCAAccounts that belong to a user.
     * @param _user Address of the account creator.
     * @return An array of DCAAccount addresses.
     */
    function getAccountsOfUser(
        address _user
    ) external view returns (address[] memory);

    /**
     * @notice Updates the DCAExecutor address.
     * @param _newExecutorAddress The new address of the DCAExecutor.
     */
    function updateExecutorAddress(address _newExecutorAddress) external;

    /**
     * @notice Updates the DCAReinvestLibrary address.
     * @param newAddress_ The new address of the DCAReinvestLibrary.
     */
    function updateReinvestLibraryAddress(address newAddress_) external;

    /**
     * @notice Returns the active state of the factory.
     * @return A boolean indicating whether the factory is active.
     */
    function getFactoryActiveState() external view returns (bool);

    /**
     * @notice Returns the active address of the DCAExecutor.
     * @return The address of the active DCAExecutor.
     */
    function getActiveExecutorAddress() external view returns (address);

    /**
     * @notice Returns the total number of deployed DCAAccounts.
     * @return The total number of deployed DCAAccounts.
     */
    function getTotalDeployedAccounts() external view returns (uint256);
}
