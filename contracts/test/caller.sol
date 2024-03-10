pragma solidity ^0.8.20;
import "hardhat/console.sol";

contract Caller {
    address public calledContract;

    constructor(address calledContract_) {
        calledContract = calledContract_;
    }

    function call() external returns (uint256 amount, bool success) {
        if (calledContract != address(0x0)) {
            (amount, success) = _call();
            console.log("> Top Level call return", amount, success);
            emit CompleteCall(amount, success);
        }
    }

    function updateCalledAddress(address newAddress_) public {
        calledContract = newAddress_;
        emit ChangedCalledAddress(newAddress_);
    }

    function _call() internal returns (uint256 amount, bool success) {
        bytes4 selector = bytes4(keccak256("callMe()"));
        (bool txSuccess, bytes memory returnData) = calledContract.delegatecall(
            abi.encodeWithSelector(selector)
        );

        if (txSuccess) {
            console.log("> Got delegate return");
            if (returnData.length > 0) {
                (amount, success) = abi.decode(returnData, (uint256, bool));
                console.log(
                    "> Decoded return data - amount:",
                    amount,
                    "success:",
                    success
                );
                emit ReturnedData(returnData, txSuccess);
                return (amount, success);
            } else {
                console.log("> Empty return data");
                return (amount, success);
            }
        } else {
            console.log("Failed to DelegateCall");
            emit ReturnedData(returnData, txSuccess);
            return (amount, success);
        }
    }

    event ReturnedData(bytes returnData, bool txSuccess);
    event CompleteCall(uint256 number, bool success);
    event ChangedCalledAddress(address);
}
