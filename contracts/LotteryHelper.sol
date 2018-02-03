pragma solidity ^0.4.18;

import "./Lottery.sol";

contract LotteryHelper is Lottery {
  function getLotteryData(address _lotteryId) public view returns (
    uint betAmount,
    uint firstBetTime,
    uint firstRevealTime,
    address winnerAddress
    ) {
    LotteryData storage lottery = lotteries[_lotteryId];
    return (
      lottery.betAmount,
      lottery.firstBetTime,
      lottery.firstRevealTime,
      lottery.winnerAddress
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
      LotteryData storage lottery = lotteries[_lotteryId];
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
}
