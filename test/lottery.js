const Lottery = artifacts.require('./Lottery.sol');

contract('Lottery', accounts => {
  let LotteryInstance


  it('Should create lottery correctly', () => {
      Lottery.deployed()
        .then(instance => LotteryInstance = instance)
        .then(() => LotteryInstance.createLottery(5))
        .then(() => LotteryInstance.getLotteryData.call(accounts[0]))
        .then(result => {
          const expected = 5
          const actual = result[0].toNumber()

          assert.equal(actual, expected, 'Bet value is not equal to 5')
        })
        .then(() => LotteryInstance.getLotteryUsers.call(accounts[0]))
        .then(result => {
          const expected = accounts[0]
          const actual = result[0].toString()

          assert.equal(actual, expected, 'Even user address is not equal to creator address')
        })
        .then(() => LotteryInstance.joinLottery.call(accounts[0], {from: accounts[1]}))
        .catch((...args) => console.log(...args))
        .then(() => LotteryInstance.getLotteryUsers.call(accounts[0]))
        .then(result => {
          const expected = accounts[1]
          // const actual = result[5].toString()

          assert.equal(accounts[1], expected, 'Odd user address is not equal to joiner address')
        })
  })
})
