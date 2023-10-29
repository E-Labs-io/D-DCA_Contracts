// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./DCADataStructures.sol";

interface IDCAAccount {
    function Execute(uint256 strategyId_) external;

    function SetupStratogy(
        Strategy newStrategy_,
        uint256 seedFunds_,
        bool subscribeToEcecutor_
    ) external;

    function SubscribeStratogy(
        uint256 stratogyId_
    ) external returns (bool success);

    function UnsubscribeStratogy(
        uint256 stratogyId
    ) external returns (bool success);

    function FundAccount(IERC20 token_, uint256 amount_) external;
}
