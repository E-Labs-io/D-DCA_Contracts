pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract OnlyExecutor is Ownable {
    address private _executor;

    modifier onlyExecutor() {
        require(_executor == msg.sender, "Address is not the executor");
        _;
    }

    constructor(address _owner) Ownable(_owner) {}

    function _changeExecutorAddress(address newAddress_) internal {
        _executor = newAddress_;
    }

    function removeExecutor() public onlyOwner {
        _executor = address(0x0);
    }

    function changeExecutor(address newExecutorAddress_) public onlyOwner {
        _executor = address(newExecutorAddress_);
    }

    function getExecutorAddress() public view returns (address) {
        return _executor;
    }
}
