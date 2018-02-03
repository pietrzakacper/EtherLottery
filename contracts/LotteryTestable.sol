pragma solidity ^0.4.19;

import "./LotteryHelper.sol";

contract LotteryTestable is LotteryHelper {
    function enableTimeTesting() public {
        timeToEnableCanceling = 0;
    } 
}