const sha3 = require('solidity-sha3').default
const Lottery = artifacts.require('./LotteryTestable.sol')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)


contract('Odd player withdraws after placing bet', accounts => {
  const lotteryId = accounts[0]
  const oddUser = accounts[1]
  const betValue = web3.toWei(5, "ether")
  const salt = 'alamakota'
  const oddSecretNumber = 5
  const oddHash = sha3(salt, oddSecretNumber)

  let LotteryInstance

  const setUpLottery = async () => {
    LotteryInstance = await Lottery.deployed()

    await LotteryInstance.createLottery(betValue)

    await LotteryInstance.joinLottery(lotteryId, {
      from: oddUser
    })

    await LotteryInstance.placeBet(lotteryId, oddHash, {
      from: oddUser,
      value: betValue
    })

    await LotteryInstance.enableTimeTesting()        

    await LotteryInstance.cancelLotteryAfterOneBet(lotteryId, {
      from: oddUser
    })
  }

  it('Even user should not be able to withdraw', async () => {
    await setUpLottery()
    
    try {
      await LotteryInstance.withdrawFundsAfterOneBet(lotteryId)
      assert(false, 'withdrawFundsAfterOneBet should throw called by even user')
    } catch (e) {
      assert(true)
    }

    const stateAfterWithdrawCall = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterWithdrawCall, 'WITHDRAWING_FUNDS_AFTER_ONE_BET')
  })

  it('Odd user should withdraw correctly', async () => {
    const balanceBefore = web3.fromWei(web3.eth.getBalance(oddUser))

    await LotteryInstance.withdrawFundsAfterOneBet(lotteryId, {
      from: oddUser
    })

    const balanceAfter = web3.fromWei(web3.eth.getBalance(oddUser))
    const isBalanceAfterGreaterThanBefore = balanceAfter > balanceBefore

    assert(isBalanceAfterGreaterThanBefore, 'Odd users balance should increase after withdrawal')
  })

  it('Lottery should end correctly', async () => {
    const stateAfterAnotherWithdrawCall = await LotteryInstance.getLotteryState.call(lotteryId)

    assert.equal(stateAfterAnotherWithdrawCall, 'LOTTERY_ENDED')
  })
})