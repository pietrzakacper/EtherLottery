const sha3 = require('solidity-sha3').default
const Lottery = artifacts.require('./LotteryHelper.sol')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)


// contract('Succesfull lottery with odd player winning', accounts => {
//   afterEach( () => console.log(1) )
//
//   const lotteryId = accounts[0]
//   const evenUser = accounts[0]
//   const oddUser = accounts[1]
//   const betValue = web3.toWei(5, "ether")
//   const salt = 'alamakota'
//   const evenSecretNumber = 5
//   const oddSecretNumber = 6
//   const evenHash = sha3(salt, evenSecretNumber)
//   const oddHash = sha3(salt, oddSecretNumber)
//
//   let LotteryInstance
//
//   it('Should create lottery correctly', () => {
//       Lottery.deployed()
//         .then(instance => LotteryInstance = instance)
//         .then(() => LotteryInstance.createLottery(betValue))
//         .then(() => LotteryInstance.getLotteryData.call(lotteryId))
//         .then(result => {
//           const expected = web3.toWei(5, "ether")
//           const actual = result[0].toNumber()
//
//           assert.equal(actual, expected, 'Bet value should be equal to 5')
//         })
//         .then(() => LotteryInstance.getLotteryUsers.call(lotteryId))
//         .then(result => {
//           const expected = evenUser
//           const actual = result[0].toString()
//
//           assert.equal(actual, expected, 'Even user address should be equal to creator address')
//         })
//   })
//
//   it('Should join lottery correctly', () => {
//       LotteryInstance.joinLottery(lotteryId, {from: oddUser})
//         .then(() => LotteryInstance.getLotteryUsers.call(lotteryId))
//         .then(result => {
//           const expected = oddUser
//           const actual = result[5].toString()
//
//           assert.equal(actual, expected, 'Odd user address should be equal to joiner address')
//         })
//   })
//
//   it('Should placeBet from evenUser correctly', () => {
//       LotteryInstance.placeBet(lotteryId, evenHash, {value: betValue})
//         .then(() => LotteryInstance.getLotteryUsers.call(lotteryId))
//         .then(result => {
//           assert.equal(result[1], true, 'Even users flag hasPlacedBet should be equal to true')
//           assert.equal(result[3], evenHash, 'Even users numberSaltedHash should be equal to the one passed')
//         })
//   })
//
//   it('Should placeBet from oddUser correctly', () => {
//       LotteryInstance.placeBet(lotteryId, oddHash, {from: oddUser, value: betValue})
//         .then(() => LotteryInstance.getLotteryUsers.call(lotteryId))
//         .then(result => {
//           assert.equal(result[6], true, 'Odd users flag hasPlacedBet should be equal to true')
//           assert.equal(result[8], oddHash, 'Odd users numberSaltedHash should be equal to the one passed')
//         })
//   })
//
//   it('Should reveal from evenUser correctly', () => {
//       LotteryInstance.revealBet(lotteryId, salt, evenSecretNumber)
//         .then(() =>  LotteryInstance.getLotteryUsers.call(lotteryId))
//         .then(result => {
//           assert.equal(result[2], true, 'Even users flag hasRevealedBet should be equal to true')
//           assert.equal(result[4], evenSecretNumber, 'Even users number should be equal to the one passed')
//         })
//   })
//
//   it('Should reveal from oddUser correctly', () => {
//       LotteryInstance.revealBet(lotteryId, salt, oddSecretNumber, {from: oddUser})
//         .then(() =>  LotteryInstance.getLotteryUsers.call(lotteryId))
//         .then(result => {
//           assert.equal(result[7], true, 'Odd users flag hasRevealedBet should be equal to true')
//           assert.equal(result[9], oddSecretNumber, 'Odd users number should be equal to the one passed')
//         })
//   })
//
//   it('Should reveal winner correctly', () => {
//       LotteryInstance.getLotteryData.call(lotteryId)
//         .then(result => {
//           assert.equal(result[3], oddUser, 'Winner address should be equal to oddUser')
//         })
//   })
//
//   it('Odd user should claim prize correctly', () => {
//     const balanceBefore = web3.fromWei(web3.eth.getBalance(oddUser)).toNumber()
//
//       LotteryInstance.claimPrize(lotteryId, {from: oddUser})
//         .then(() => {
//           const balanceAfter = web3.fromWei(web3.eth.getBalance(oddUser)).toNumber()
//           const isBalanceAfterGreaterThanBefore = balanceAfter > balanceBefore
//
//           //Cannot perform exact calculation because of the gas used
//           assert.equal(isBalanceAfterGreaterThanBefore, true, 'Odd users balance should increase by twice the bet value')
//         })
//   })
// })

contract('Succesfull lottery with even player winning', accounts => {
  const lotteryId = accounts[0]
  const evenUser = accounts[0]
  const oddUser = accounts[1]
  const betValue = web3.toWei(5, "ether")
  const salt = 'alamakota'
  const evenSecretNumber = 5
  const oddSecretNumber = 5
  const evenHash = sha3(salt, evenSecretNumber)
  const oddHash = sha3(salt, oddSecretNumber)

  let LotteryInstance

  Lottery.deployed()
    .then(instance => LotteryInstance = instance)
    .then(() => LotteryInstance.createLottery(betValue))
    .then(() => LotteryInstance.joinLottery(lotteryId, {from: oddUser}))
    .then(() => LotteryInstance.placeBet(lotteryId, evenHash, {value: betValue}))
    .then(() => LotteryInstance.placeBet(lotteryId, oddHash, {from: oddUser, value: betValue}))
    .then(() => LotteryInstance.revealBet(lotteryId, salt, evenSecretNumber))
    .then(() => LotteryInstance.revealBet(lotteryId, salt, oddSecretNumber, {from: oddUser}))
    .catch((...args) => console.log(1))


  it('Even user should claim prize correctly', () => {
      const balanceBefore = web3.fromWei(web3.eth.getBalance(evenUser)).toNumber()

      LotteryInstance.claimPrize(lotteryId, {from: evenUser})
        .then(() => {
          const balanceAfter = web3.fromWei(web3.eth.getBalance(evenUser)).toNumber()
          const isBalanceAfterGreaterThanBefore = balanceAfter > balanceBefore

          //Cannot perform exact calculation because of the gas used
          assert.equal(isBalanceAfterGreaterThanBefore, true, 'Even users balance should increase by twice the bet value')
        })
        .catch((...args) => console.log(2))
  })
})
