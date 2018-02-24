import {call, put, takeLatest, select} from 'redux-saga/effects'
import {getEth, getEventFromLogs, promisify} from './utils/ethUtils'
import {ethInjected, setPage, setLotteryContract, setPageError, changePageToPlaceBets, changePageToWaitForOtherPlayerToJoin} from './actionCreators'
import {actions, pages, lotteryStates} from './constants'

import Lottery from '../build/contracts/LotteryHelper.json'
import contract from 'truffle-contract'

import sha3 from 'solidity-sha3'

function* injectWeb3() {
    const {eth} = yield call(getEth)
    yield put(ethInjected(eth))

    const lotteryContract = yield call(contract, Lottery)
    lotteryContract.setProvider(eth.currentProvider)
    
    yield put(setLotteryContract(lotteryContract))

    yield put(setPage(pages.LANDING))
}

function* createNewLottery(action) {
    const {lotteryContract, eth} = yield select(store => store.toJS())

    const lotteryInstance = yield call(lotteryContract.deployed)
    const [userAccount] = yield call(eth.accounts)
    const lotteryState = yield call(lotteryInstance.getLotteryState.call, userAccount)
    
    if(lotteryState !== lotteryStates.UNINITIALIZED) {
        yield put(setPageError(
            `You've already created a lottery.
             Join your lottery using your accounts address: "${userAccount}"`
        ))
        return
    }

    const {logs: lotteryCreatedLogs} = yield call(lotteryInstance.createLottery, action.betAmount, {from: userAccount})
    const {lotteryId, betAmount} = getEventFromLogs(lotteryCreatedLogs, 'LotteryCreated')

    yield put(changePageToWaitForOtherPlayerToJoin(lotteryId))

    const {args: {user: otherUser}} = yield call(promisify(lotteryInstance.UserJoinedLottery), {lotteryId})
 
    yield put(changePageToPlaceBets(otherUser, lotteryId, betAmount))
}

function* joinLottery({lotteryId}) {
    const {lotteryContract, eth} = yield select(store => store.toJS())
    
    const lotteryInstance = yield call(lotteryContract.deployed)
    const lotteryState = yield call(lotteryInstance.getLotteryState.call, lotteryId)

    if(lotteryState === lotteryStates.UNINITIALIZED) {
        yield put(setPageError(
            'This lottery is not created.'
        ))
        return
    }

    const [userAccount] = yield call(eth.accounts)    

    if(lotteryState !== lotteryStates.LOTTERY_CREATED) {
        console.log('TODO: handle page change')
        return
    }

    yield call(lotteryInstance.joinLottery, lotteryId, {from: userAccount})

    const [lotteryCreator] = yield call(lotteryInstance.getLotteryUsers.call, lotteryId)
    const [betAmount] = yield call(lotteryInstance.getLotteryData.call, lotteryId)

    yield put(changePageToPlaceBets(lotteryCreator, lotteryId, betAmount))
}

function* placeBet({userNumber, salt}) {
    const {lotteryContract, eth, lotteryId, betAmount, otherPlayer} = yield select(store => store.toJS())

    const lotteryInstance = yield call(lotteryContract.deployed)
    const [userAccount] = yield call(eth.accounts)        
    
    const numberSaltedHash = sha3(userNumber, salt)

    yield call(lotteryInstance.placeBet, lotteryId, numberSaltedHash, {from: userAccount, value: betAmount})
    
    const lotteryState = yield call(lotteryInstance.getLotteryState.call, lotteryId)

    if(lotteryState === lotteryStates.PLACING_BETS) {
        yield put(setPage(pages.WAITING_FOR_OTHER_PLAYER_TO_PLACE_BET))
        yield call(promisify(lotteryInstance.BetPlaced), {lotteryId, user: otherPlayer})
    }

    yield put(setPage(pages.REVEAL_BET))
}
export default function* rootSaga() {
    yield takeLatest(actions.ETH_REQUESTED, injectWeb3)
    yield takeLatest(actions.CREATE_LOTTERY_REQUESTED, createNewLottery)
    yield takeLatest(actions.JOIN_LOTTERY_REQUESTED, joinLottery)
    yield takeLatest(actions.PLACE_BET_REQUESTED, placeBet)
}