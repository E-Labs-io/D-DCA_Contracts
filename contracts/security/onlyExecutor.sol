pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract OnlyExecutor is Ownable {
    address private _executorAddress;

    event ExecutorAddressChange(address indexed newAddress_);

    modifier onlyExecutor() {
        require(
            _executorAddress == msg.sender,
            "OnlyExecutor : [onlyExecutor] Address is not an executor"
        );
        _;
    }

    constructor(address owner_, address executorAddress_) Ownable(owner_) {
        _changeExecutorAddress(executorAddress_);
    }

    function _executor() internal view returns (address) {
        return _executorAddress;
    }

    function _changeExecutorAddress(address executorAddress_) internal {
        _executorAddress = executorAddress_;
        emit ExecutorAddressChange(executorAddress_);
    }

    function removeExecutor() public onlyOwner {
        _changeExecutorAddress(address(0x0));
    }

    function changeExecutor(address executorAddress_) public onlyOwner {
        _changeExecutorAddress(executorAddress_);
    }
       function getExecutorAddress() public view returns(address){
        return _executorAddress;
    }
}
