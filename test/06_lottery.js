const sha3 = require('solidity-sha3').default
const Lottery = artifacts.require('./LotteryTestable.sol')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)

contract('Even user withdraws after revealing bet', accounts => {
  const lotteryId = accounts[0]
  const evenUser = accounts[0]
  const oddUser = accounts[1]
  const betValue = web3.toWei(5, "ether")
  const salt = 'alamakota'
  const evenSecretNumber = 5
  const oddSecretNumber = 7
  const evenHash = sha3(salt, evenSecretNumber)
  const oddHash = sha3(salt, oddSecretNumber)

  let LotteryInstance

  const setUpLottery = async () => {
    LotteryInstance = await Lottery.deployed()

    await LotteryInstance.createLottery(betValue)

    await LotteryInstance.joinLottery(lotteryId, {
      from: oddUser
    })

    await LotteryInstance.placeBet(lotteryId, evenHash, {
      value: betValue
    })

    await LotteryInstance.placeBet(lotteryId, oddHash, {
      from: oddUser,
      value: betValue
    })

    await LotteryInstance.revealBet(lotteryId, salt, evenSecretNumber)

    await LotteryInstance.enableTimeTesting()

    await LotteryInstance.cancelLotteryAfterOneReveal(lotteryId)
  }

  it('Odd user should not be able to reveal bet', async () => {
    try{
      await LotteryInstance.revealBet(lotteryId, salt, oddSecretNumber, {from: oddUser})
      assert(false, 'revealBet should throw')
    } catch(e) {
      assert(true)
    }
  })

  it('Odd user should not be able to withdraw', async () => {
    await setUpLottery()

    try {
      await LotteryInstance.withdrawFundsAfterOneReveal(lotteryId, {from: oddUser})
      assert(false, 'withdrawFundsAfterOneReveal should throw called by odd user')
    } catch (e) {
      assert(true)
    }

    const stateAfterWithdrawCall = await LotteryInstance.getLotteryState.call(lotteryId)

    assert.equal(stateAfterWithdrawCall, 'WITHDRAWING_FUNDS_AFTER_ONE_REVEAL')
  })

  it('Odd user should withdraw correctly', async () => {
    const balanceBefore = web3.fromWei(web3.eth.getBalance(evenUser))

    await LotteryInstance.withdrawFundsAfterOneReveal(lotteryId)

    const balanceAfter = web3.fromWei(web3.eth.getBalance(evenUser))
    const isBalanceAfterGreaterThanBefore = balanceAfter > balanceBefore

    assert(isBalanceAfterGreaterThanBefore, 'Even users balance should increase after withdrawal')
  })

  it('Lottery should end correctly', async () => {
    const stateAfterWithdrawCall = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterWithdrawCall, 'LOTTERY_ENDED')
  })
})