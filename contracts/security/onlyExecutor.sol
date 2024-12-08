// SPDX-License-Identifier: MIT
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
abstract contract OnlyExecutor is Ownable {
    /**
     * @notice The address of the executor
     */
    address private _executorAddress;

    /**
     * @notice Emitted when the executor address is changed
     * @param newAddress_ The new executor address
     */
    event ExecutorAddressChange(address indexed newAddress_);

    /**
     * @notice Modifier to check if the caller is the executor
     */
    modifier onlyExecutor() {
        require(
            _executorAddress == msg.sender,
            "OnlyExecutor : [onlyExecutor] Address is not an executor"
        );
        _;
    }

    /**
     * @notice Constructor for the OnlyExecutor contract
     * @param owner_ The owner of the contract
     * @param executorAddress_ The address of the executor
     */
    constructor(address owner_, address executorAddress_) Ownable(owner_) {
        _changeExecutorAddress(executorAddress_);
    }

    /**
     * @notice Returns the executor address
     * @return The executor address
     */
    function _executor() internal view returns (address) {
        return _executorAddress;
    }

    /**
     * @notice Changes the executor address
     * @param executorAddress_ The new executor address
     */
    function _changeExecutorAddress(address executorAddress_) internal {
        _executorAddress = executorAddress_;
        emit ExecutorAddressChange(executorAddress_);
    }

    /**
     * @notice Removes the executor address
     */
    function removeExecutor() public onlyOwner {
        _changeExecutorAddress(address(0x0));
    }

    function changeExecutor(address executorAddress_) public onlyOwner {
        _changeExecutorAddress(executorAddress_);
    }

    /**
     * @notice Returns the executor address
     * @return The executor address
     */
    function getExecutorAddress() public view returns (address) {
        return _executorAddress;
    }
}
