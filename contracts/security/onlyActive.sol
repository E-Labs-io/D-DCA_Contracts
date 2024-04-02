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
abstract contract OnlyActive is Ownable {
    bool private _active = true;

    event ContractActiveStateChange(bool indexed newState_);

    modifier is_active() {
        require(_active, "OnlyActive : [isActive] Contract is paused");
        _;
    }

    function isActive() public view returns (bool) {
        return _active;
    }

    function _setActiveState(bool newState_) internal {
        _active = newState_;
        emit ContractActiveStateChange(newState_);
    }

    function _getActiveState() internal view returns (bool) {
        return _active;
    }
}
