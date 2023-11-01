pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract OnlyExecutor is Ownable {
    address private _executor;

    constructor(address executorAddress_) {
        _executor = executorAddress_;
    }

    modifier onlyExecutor() {
        require(_executor == msg.sender, "Address is not the executor");
        _;
    }

    function _changeExecutorAddress(address newAddress_) internal {
        _executor = newAddress_;
    }

    function removeExecutor() public onlyOwner {
        _executor = address(0x0);
    }

    function changeExecutor(address newExecutorAddress_) public onlyOwner {
        _executor = address(newExecutorAddress_);
    }
}
