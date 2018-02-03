const sha3 = require('solidity-sha3').default
const Lottery = artifacts.require('./LotteryTestable.sol')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)


contract('Even player withdraws after placing bet', accounts => {
  const lotteryId = accounts[0]
  const evenUser = accounts[0]
  const oddUser = accounts[1]
  const betValue = web3.toWei(5, "ether")
  const salt = 'alamakota'
  const evenSecretNumber = 5
  const evenHash = sha3(salt, evenSecretNumber)
  const oddSecretNumber = 5
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

    await LotteryInstance.enableTimeTesting()
  }

  it('Odd user should not bet able to place bet paying incorrect ether amount', async () => {
    await setUpLottery()
    
    try {
      await LotteryInstance.placeBet(lotteryId, oddHash, {
        from: oddUser,
        value: betValue - web3.toWei(1, "ether")
      })
      assert(false, 'placeBet should throw given incorrect betValue')
    } catch (e) {
      assert(true)
    }
  })

  it('Unknown user should not bet able to place bet', async () => {    
    try {
      await LotteryInstance.placeBet(lotteryId, oddHash, {
        from: accounts[3],
        value: betValue
      })
      assert(false, 'placeBet should throw being called by unknown user')
    } catch (e) {
      assert(true)
    }
  })

  it('Lottery should be cancelled correctly', async () => {
    await LotteryInstance.cancelLotteryAfterOneBet(lotteryId)

    const stateAfterCancelCall = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterCancelCall, 'WITHDRAWING_FUNDS_AFTER_ONE_BET')
  })

  it('Odd user should not be able to withdraw', async () => {
    try {
      await LotteryInstance.withdrawFundsAfterOneBet(lotteryId, {
        from: oddUser
      })
      assert(false, 'withdrawFundsAfterOneBet should throw called by even user')
    } catch (e) {
      assert(true)
    }

    const stateAfterWithdrawCall = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterWithdrawCall, 'WITHDRAWING_FUNDS_AFTER_ONE_BET')
  })

  it('Even user should withdraw funds correctly', async () => {
    const balanceBefore = web3.fromWei(web3.eth.getBalance(evenUser))

    await LotteryInstance.withdrawFundsAfterOneBet(lotteryId)

    const balanceAfter = web3.fromWei(web3.eth.getBalance(evenUser))
    const isBalanceAfterGreaterThanBefore = balanceAfter > balanceBefore

    assert(isBalanceAfterGreaterThanBefore, 'Odd users balance should increase after withdrawal')
  })

  it('Lottery should end correctly', async () => {
    const stateAfterAnotherWithdrawCall = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterAnotherWithdrawCall, 'LOTTERY_ENDED')
  })
})