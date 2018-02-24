pragma solidity ^0.4.19;

contract Lottery {
    struct User {
        address userAddress;
        bool hasPlacedBet;
        bool hasRevealedBet;
        bytes32 numberSaltedHash;
        uint number;
    }

    enum State {
        UNINITIALIZED,
        LOTTERY_CREATED,
        PLACING_BETS,
        WITHDRAWING_FUNDS_AFTER_ONE_BET,
        REVEALING_BETS,
        WITHDRAWING_FUNDS_AFTER_ONE_REVEAL,
        REVEALING_WINNER,
        CLAIMING_PRIZE,
        LOTTERY_ENDED
    }

    struct LotteryData {
        User evenUser;
        User oddUser;
        uint betAmount;
        State state;
        uint firstBetTime;
        uint firstRevealTime;
        address winnerAddress;
    }

    mapping(address => LotteryData) lotteries;
    uint public timeToEnableCanceling = 24 hours;


    event LotteryCreated(address indexed lotteryId, address creator, uint betAmount);
    event UserJoinedLottery(address indexed lotteryId, address user);
    event BetPlaced(address indexed lotteryId, address indexed user);
    event RevealState(address indexed lotteryId);
    event BetRevealed(address indexed lotteryId, address indexed user);
    event WinnerRevealed(address indexed lotteryId, address indexed user);

    function createLottery(uint _betAmount) public returns (address lotteryId) {
        lotteryId = msg.sender;

        require(isLotteryValid(lotteryId) == false);

        LotteryData storage lottery = lotteries[lotteryId];

        lottery.evenUser.userAddress = msg.sender;
        lottery.betAmount = _betAmount;
        lottery.state = State.LOTTERY_CREATED;

        LotteryCreated(lotteryId, msg.sender, _betAmount);
    }

    function joinLottery(address _lotteryId) public isValidState(_lotteryId, State.LOTTERY_CREATED) {
        LotteryData storage lottery = lotteries[_lotteryId];
        lottery.oddUser.userAddress = msg.sender;
        lottery.state = State.PLACING_BETS;

        UserJoinedLottery(_lotteryId, msg.sender);
    }

    function isLotteryValid(address _lotteryId) private view returns (bool) {
        return lotteries[_lotteryId].state != State.UNINITIALIZED && lotteries[_lotteryId].state != State.LOTTERY_ENDED;
    }

    function getValidUser(LotteryData storage _lottery) private view returns (User storage validUser) {
        if (msg.sender == _lottery.evenUser.userAddress) {
            validUser = _lottery.evenUser;
        }

        if (msg.sender == _lottery.oddUser.userAddress) {
            validUser = _lottery.oddUser;
        }

        require(validUser.userAddress != address(0));
    }

    modifier validAmount(address _lotteryId) {
        require(msg.value == lotteries[_lotteryId].betAmount);
        _;
    }

    modifier isValidState(address _lotteryId, State _state) {
        require(lotteries[_lotteryId].state == _state);
        _;
    }

    function placeBet(address _lotteryId, bytes32 _userNumberSaltedHash) public payable isValidState(_lotteryId, State.PLACING_BETS) validAmount(_lotteryId) {
        LotteryData storage lottery = lotteries[_lotteryId];
        User storage validUser = getValidUser(lottery);

        require(validUser.hasPlacedBet == false);

        validUser.hasPlacedBet = true;
        validUser.numberSaltedHash = _userNumberSaltedHash;

        BetPlaced(_lotteryId, msg.sender);

        if (lottery.oddUser.hasPlacedBet && lottery.evenUser.hasPlacedBet) {
            lottery.state = State.REVEALING_BETS;
            RevealState(_lotteryId);
            return;
        }

        lottery.firstBetTime = now;
    }


    function revealBet(address _lotteryId, string _salt, uint _userNumber) public isValidState(_lotteryId, State.REVEALING_BETS) {
        LotteryData storage lottery = lotteries[_lotteryId];
        User storage validUser = getValidUser(lottery);

        bytes32 saltedHashedRevealedNumber = keccak256(_salt, _userNumber);

        require(saltedHashedRevealedNumber == validUser.numberSaltedHash);

        validUser.number = _userNumber;
        validUser.hasRevealedBet = true;

        BetRevealed(_lotteryId, msg.sender);

        if (lottery.oddUser.hasRevealedBet && lottery.evenUser.hasRevealedBet) {
            lottery.state = State.REVEALING_WINNER;
            revealWinner(_lotteryId);
            return;
        }

        lottery.firstRevealTime = now;
    }

    function revealWinner(address _lotteryId) private isValidState(_lotteryId, State.REVEALING_WINNER) {
        LotteryData storage lottery = lotteries[_lotteryId];

        uint sum = lottery.oddUser.number + lottery.evenUser.number;
        bool isSumEven = sum % 2 == 0;

        lottery.winnerAddress = isSumEven ? lottery.evenUser.userAddress : lottery.oddUser.userAddress;
        WinnerRevealed(_lotteryId, lottery.winnerAddress);

        lottery.state = State.CLAIMING_PRIZE;
    }

    modifier isWinner(address _lotteryId) {
        require(msg.sender == lotteries[_lotteryId].winnerAddress);
        _;
    }

    function claimPrize(address _lotteryId) external isWinner(_lotteryId) isValidState(_lotteryId, State.CLAIMING_PRIZE) {
        LotteryData storage lottery = lotteries[_lotteryId];

        msg.sender.transfer(2 * lottery.betAmount);
        lottery.state = State.LOTTERY_ENDED;
    }

    function cancelLottery(address _lotteryId, uint startingTime, State newState) private {
        LotteryData storage lottery = lotteries[_lotteryId];

        require(startingTime + timeToEnableCanceling <= now);

        lottery.state = newState;
    }

    function cancelLotteryAfterOneBet(address _lotteryId) public isValidState(_lotteryId, State.PLACING_BETS) {
        cancelLottery(_lotteryId, lotteries[_lotteryId].firstBetTime, State.WITHDRAWING_FUNDS_AFTER_ONE_BET);
    }

    function cancelLotteryAfterOneReveal(address _lotteryId) public isValidState(_lotteryId, State.REVEALING_BETS) {
        cancelLottery(_lotteryId, lotteries[_lotteryId].firstRevealTime, State.WITHDRAWING_FUNDS_AFTER_ONE_REVEAL);
    }

    function withdrawFunds(address _lotteryId, bool condition, uint amount) private {
        require(condition);

        msg.sender.transfer(amount);
        lotteries[_lotteryId].state = State.LOTTERY_ENDED;        
    }

    function withdrawFundsAfterOneBet(address _lotteryId) public isValidState(_lotteryId, State.WITHDRAWING_FUNDS_AFTER_ONE_BET) {
        LotteryData storage lottery = lotteries[_lotteryId];

        withdrawFunds(
            _lotteryId,
            getValidUser(lottery).hasPlacedBet,
            lottery.betAmount
        );
    }

    function withdrawFundsAfterOneReveal(address _lotteryId) public isValidState(_lotteryId, State.WITHDRAWING_FUNDS_AFTER_ONE_REVEAL) {
        LotteryData storage lottery = lotteries[_lotteryId];

        withdrawFunds(
            _lotteryId,
            getValidUser(lottery).hasRevealedBet,
            lottery.betAmount
        );
    }
}
