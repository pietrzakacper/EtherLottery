const sha3 = require('solidity-sha3').default
const Lottery = artifacts.require('./LotteryTestable.sol')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)

contract('Odd user withdraws after revealing', accounts => {
  const lotteryId = accounts[0]
  const oddUser = accounts[1]
  const betValue = web3.toWei(5, "ether")
  const salt = 'alamakota'
  const evenSecretNumber = 5
  const oddSecretNumber = 9
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

    await LotteryInstance.revealBet(lotteryId, salt, oddSecretNumber, {
      from: oddUser
    })

    await LotteryInstance.enableTimeTesting()
  }

  it('Lottery should be canceled correctly', async () => {
    await setUpLottery()    
    await LotteryInstance.cancelLotteryAfterOneReveal(lotteryId)
    
    const stateAfterCanceling = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterCanceling, 'WITHDRAWING_FUNDS_AFTER_ONE_REVEAL')
  })

  it('Even user should not be able to reveal bet', async () => {
    try{
      await LotteryInstance.revealBet(lotteryId, salt, evenSecretNumber)
      assert(false, 'revealBet should throw')
    } catch(e) {
      assert(true)
    }
  })

  it('Even user should not be able to withdraw', async () => {
    try {
      await LotteryInstance.withdrawFundsAfterOneReveal(lotteryId)
      assert(false, 'withdrawFundsAfterOneReveal should throw called by even user')
    } catch (e) {
      assert(true)
    }

    const stateAfterWithdrawCall = await LotteryInstance.getLotteryState.call(lotteryId)

    assert.equal(stateAfterWithdrawCall, 'WITHDRAWING_FUNDS_AFTER_ONE_REVEAL')
  })

  it('Odd user should withdraw correctly', async () => {
    const balanceBefore = web3.fromWei(web3.eth.getBalance(oddUser))

    await LotteryInstance.withdrawFundsAfterOneReveal(lotteryId, {
      from: oddUser
    })

    const balanceAfter = web3.fromWei(web3.eth.getBalance(oddUser))
    const isBalanceAfterGreaterThanBefore = balanceAfter > balanceBefore

    assert(isBalanceAfterGreaterThanBefore, 'Odd users balance should increase after withdrawal')
  })

  it('Lottery should end correctly', async () => {
    const stateAfterWithdrawCall = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterWithdrawCall, 'LOTTERY_ENDED')
  })
})