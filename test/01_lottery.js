const sha3 = require('solidity-sha3').default
const Lottery = artifacts.require('./LotteryHelper.sol')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://localhost:9545/')
const web3 = new Web3(provider)

contract('Odd player wins', accounts => {
  const lotteryId = accounts[0]
  const evenUser = accounts[0]
  const oddUser = accounts[1]
  const betValue = web3.toWei(5, "ether")
  const salt = 'alamakota'
  const evenSecretNumber = 5
  const oddSecretNumber = 2
  const evenHash = sha3(salt, evenSecretNumber)
  const oddHash = sha3(salt, oddSecretNumber)

  let LotteryInstance

  it('Should create lottery correctly', async () => {
    LotteryInstance = await Lottery.deployed()
    await LotteryInstance.createLottery(betValue)

    const stateAfterCreation = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterCreation, 'LOTTERY_CREATED')

    const actualBetValue = (await LotteryInstance.getLotteryData.call(lotteryId))[0].toNumber()
    assert.equal(actualBetValue, web3.toWei(5, "ether"), 'Bet value should be equal to 5')

    const actualEvenUser = (await LotteryInstance.getLotteryUsers.call(lotteryId))[0].toString()
    assert.equal(actualEvenUser, evenUser, 'Even user address should be equal to creator address')
  })

  it('Should join lottery correctly', async () => {
    await LotteryInstance.joinLottery(lotteryId, {
      from: oddUser
    })

    const stateAfterJoining = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterJoining, 'PLACING_BETS')

    const actualOddUser = (await LotteryInstance.getLotteryUsers.call(lotteryId))[5].toString()
    assert.equal(actualOddUser, oddUser, 'Odd user address should be equal to joiner address')
  })

  it('Should place bet by even user correctly', async () => {
    await LotteryInstance.placeBet(lotteryId, evenHash, {
      value: betValue
    })

    const stateAfterPlacingBet = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterPlacingBet, 'PLACING_BETS')

    const [, hasEvenUserPlacedBet, , actualEvenHash] = await LotteryInstance.getLotteryUsers.call(lotteryId)
    assert(hasEvenUserPlacedBet, 'Even users flag hasPlacedBet should be equal to true')
    assert.equal(actualEvenHash, evenHash, 'Even users numberSaltedHash should be equal to the one passed')
  })

  it('Should place bet by odd user correctly', async () => {
    await LotteryInstance.placeBet(lotteryId, oddHash, {
      from: oddUser,
      value: betValue
    })

    const stateAfterAnotherPlacingBet = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterAnotherPlacingBet, 'REVEALING_BETS')

    const usersAfterPlacingBet = await LotteryInstance.getLotteryUsers.call(lotteryId)
    assert(usersAfterPlacingBet[6], 'Odd users flag hasPlacedBet should be equal to true')
    assert.equal(usersAfterPlacingBet[8], oddHash, 'Odd users numberSaltedHash should be equal to the one passed')
  })

  it('Should reveal bet by even user correctly', async () => {
    await LotteryInstance.revealBet(lotteryId, salt, evenSecretNumber)

    const stateAfterBetReveal = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterBetReveal, 'REVEALING_BETS')

    const [, , hasEvenUserRevealedBet, , actualEvenSecretNumber] = await LotteryInstance.getLotteryUsers.call(lotteryId)
    assert(hasEvenUserRevealedBet, 'Even users flag hasRevealedBet should be equal to true')
    assert.equal(actualEvenSecretNumber, evenSecretNumber, 'Even users number should be equal to the one passed')
  })

  it('Should reveal bet by odd user correctly', async () => {
    await LotteryInstance.revealBet(lotteryId, salt, oddSecretNumber, {
      from: oddUser
    })

    const stateAfterAnotherBetReveal = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterAnotherBetReveal, 'CLAIMING_PRIZE')

    const [, , , , , , , hasOddUserRevealedBet, , actualOddSecretNumber] = await LotteryInstance.getLotteryUsers.call(lotteryId)
    assert(hasOddUserRevealedBet, 'Odd users flag hasRevealedBet should be equal to true')
    assert.equal(actualOddSecretNumber, oddSecretNumber, 'Odd users number should be equal to the one passed')

    const actualWinnerAddress = (await LotteryInstance.getLotteryData.call(lotteryId))[3]
    assert.equal(actualWinnerAddress, oddUser, 'Winner address should be equal to oddUser')
  })

  it('Odd user should claim prize correctly', async () => {
    const balanceBefore = web3.fromWei(web3.eth.getBalance(oddUser)).toNumber()

    await LotteryInstance.claimPrize(lotteryId, {
      from: oddUser
    })

    const balanceAfter = web3.fromWei(web3.eth.getBalance(oddUser)).toNumber()
    const isBalanceAfterGreaterThanBefore = balanceAfter > balanceBefore
    //Cannot perform exact calculation because of the gas used
    assert.equal(isBalanceAfterGreaterThanBefore, true, 'Odd users balance should increase by twice the bet value')
  })

  it('Lottery should end correctly', async () => {
    const stateAfterPrizeClaiming = await LotteryInstance.getLotteryState.call(lotteryId)
    assert.equal(stateAfterPrizeClaiming, 'LOTTERY_ENDED')
  })
})
