pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract OnlyActive is Ownable {
    bool private _active = true;

    event ContractActiveStateChange(bool indexed newState_);

    modifier is_active() {
        require(_active, "OnlyActive : [isActive] Contract is paused");
        _;
    }

    function setActiveState(bool newState_) public onlyOwner {
        _setActiveState(newState_);
    }

    function _setActiveState(bool newState_) internal {
        _active = newState_;
        emit ContractActiveStateChange(newState_);
    }

    function _getActiveState() internal view returns (bool) {
        return _active;
    }
}
