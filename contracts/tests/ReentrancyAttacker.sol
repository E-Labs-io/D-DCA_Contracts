// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev A malicious contract for testing reentrancy attacks
 */
contract ReentrancyAttacker {
    address public target;
    bool public attackInProgress;

    constructor(address _target) {
        target = _target;
    }

    /**
     * @dev Attempt a reentrancy attack by calling back into the target contract
     */
    function attack() external {
        attackInProgress = true;
        // This would be replaced with the actual attack vector
        // For example, calling a function that transfers tokens and then re-enters
        attackInProgress = false;
    }

    /**
     * @dev Fallback function that could be used for reentrancy
     */
    fallback() external payable {
        if (attackInProgress) {
            // Attempt reentrancy here
            attackInProgress = false; // Prevent infinite loop
        }
    }

    /**
     * @dev Receive function
     */
    receive() external payable {
        if (attackInProgress) {
            // Attempt reentrancy here
            attackInProgress = false; // Prevent infinite loop
        }
    }
}