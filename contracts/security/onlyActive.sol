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
abstract contract OnlyActive {
    /**
     * @notice The active state of the contract
     */
    bool private _active = true;

    /**
     * @notice Emitted when the active state of the contract is changed
     * @param active_ The new active state
     */
    event ContractActiveStateChange(bool indexed active_);

    /**
     * @notice Error thrown when the contract is paused
     */
    error ContractIsPaused();

    /**
     * @notice Modifier to check if the contract is active
     */
    modifier is_active() {
        if (!_active) revert ContractIsPaused();
        _;
    }

    /**
     * @notice Returns the active state of the contract
     * @return isActive True if the contract is active, false otherwise
     */
    function isActive() external view virtual returns (bool) {
        return _active;
    }

    /**
     * @notice Sets the active state of the contract
     * @param active_ The new active state
     */
    function _setActiveState(bool active_) internal {
        _active = active_;
        emit ContractActiveStateChange(active_);
    }

    /**
     * @notice Returns the active state of the contract
     * @return True if the contract is active, false otherwise
     */
    function _getActiveState() internal view returns (bool) {
        return _active;
    }
}
