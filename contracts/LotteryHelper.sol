pragma solidity ^0.4.19;

import "./Lottery.sol";

contract LotteryHelper is Lottery {
  function getLotteryData(address _lotteryId) public view returns (
    uint betAmount,
    uint firstBetTime,
    uint firstRevealTime,
    address winnerAddress,
    State state
    ) {
    var lottery = lotteries[_lotteryId];
    return (
      lottery.betAmount,
      lottery.firstBetTime,
      lottery.firstRevealTime,
      lottery.winnerAddress,
      lottery.state
    );
  }

  function getLotteryUsers(address _lotteryId) public view returns (
      address evenUserAddress,
      bool evenHasPlacedBet,
      bool evenHasRevealedBet,
      bytes32 evenNumberSaltedHash,
      uint evenNumber,
      address oddUserAddress,
      bool oddHasPlacedBet,
      bool oddHasRevealedBet,
      bytes32 oddNumberSaltedHash,
      uint oddNumber
    ) {
      var lottery = lotteries[_lotteryId];
      return (
        lottery.evenUser.userAddress,
        lottery.evenUser.hasPlacedBet,
        lottery.evenUser.hasRevealedBet,
        lottery.evenUser.numberSaltedHash,
        lottery.evenUser.number,
        lottery.oddUser.userAddress,
        lottery.oddUser.hasPlacedBet,
        lottery.oddUser.hasRevealedBet,
        lottery.oddUser.numberSaltedHash,
        lottery.oddUser.number
      );
    }

    function getLotteryState(address _lotteryId) public view returns (string) {
      var _state = lotteries[_lotteryId].state;
      
      if (_state == State.UNINITIALIZED)
        return "UNINITIALIZED";
      if (_state == State.LOTTERY_CREATED)
        return "LOTTERY_CREATED";
      if (_state == State.PLACING_BETS)
        return "PLACING_BETS";
      if (_state == State.WITHDRAWING_FUNDS_AFTER_ONE_BET)
        return "WITHDRAWING_FUNDS_AFTER_ONE_BET";
      if (_state == State.REVEALING_BETS)
        return "REVEALING_BETS";
      if (_state == State.WITHDRAWING_FUNDS_AFTER_ONE_REVEAL)
        return "WITHDRAWING_FUNDS_AFTER_ONE_REVEAL";
      if (_state == State.REVEALING_WINNER)
        return "REVEALING_WINNER";
      if (_state == State.CLAIMING_PRIZE)
        return "CLAIMING_PRIZE";
      if (_state == State.LOTTERY_ENDED)
        return "LOTTERY_ENDED";
    }
}
