const sha3 = require('solidity-sha3').default
const Lottery = artifacts.require('./LotteryHelper.sol')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)

contract('Even player wins', accounts => {
  const lotteryId = accounts[0]
  const evenUser = accounts[0]
  const oddUser = accounts[1]
  const betValue = web3.toWei(5, "ether")
  const salt = 'alamakota'
  const evenSecretNumber = 5
  const oddSecretNumber = 3
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
  }

  it('Odd user should not be able to reveal bet with incorrect number', async () => {
    await setUpLottery()

    try {
      await LotteryInstance.revealBet(lotteryId, salt, oddSecretNumber + 1, {
        from: oddUser
      })
      assert(false, 'revealBet should throw given number different from hashed one')
    } catch (e) {
      assert(true)
    }
  })

  it('Unknown user should not be able to reveal bet', async () => {    
    try {
      await LotteryInstance.revealBet(lotteryId, salt, oddSecretNumber, {
        from: accounts[3]
      })
      assert(false, 'revealBet should throw being called by unknown user')
    } catch (e) {
      assert(true)
    }
  })

  it('Odd user should not be able to claim prize', async () => {
    await LotteryInstance.revealBet(lotteryId, salt, oddSecretNumber, {
      from: oddUser
    })
    
    try {
      await LotteryInstance.claimPrize(lotteryId, {
        from: oddUser
      })
      assert(false, 'Contract should throw on odd user claiming prize')      
    } catch (e) {
      assert(true)
    }
  })

  it('Even user should claim prize correctly', async () => {
    const balanceBefore = web3.fromWei(web3.eth.getBalance(evenUser)).toNumber()
    
    await LotteryInstance.claimPrize(lotteryId, {
      from: evenUser
    })
      
    const balanceAfter = web3.fromWei(web3.eth.getBalance(evenUser)).toNumber()
    const isBalanceAfterGreaterThanBefore = balanceAfter > balanceBefore
    //Cannot perform exact calculation because of the gas used
    assert(isBalanceAfterGreaterThanBefore, 'Even users balance should increase')
  })

  it('Lottery should end correctly', async () => {
    const stateAfterPrizeClaiming = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterPrizeClaiming, 'LOTTERY_ENDED')
  })
})