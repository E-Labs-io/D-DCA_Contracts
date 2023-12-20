// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Proxy Contract
contract LibraryProxy {
    address public implementation;

    constructor(address _initialImplementation) {
        implementation = _initialImplementation;
    }

    function upgrade(address _newImplementation) external {
        // Add security checks for upgrade
        implementation = _newImplementation;
    }

    fallback() external {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}
