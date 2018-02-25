import {call, put, select} from 'redux-saga/effects'
import {getEventFromLogs, promisify} from '../utils/ethUtils'
import {setPageError, changePageToPlaceBets, changePageToWaitForOtherPlayerToJoin} from '../actionCreators'
import {lotteryStates} from '../constants'

export default function* createNewLottery(action) {
    const {lotteryContract, eth} = yield select(store => store.toJS())

    const lotteryInstance = yield call(lotteryContract.deployed)
    const [userAccount] = yield call(eth.accounts)
    const lotteryState = yield call(lotteryInstance.getLotteryState.call, userAccount)

    console.log(lotteryInstance)
    
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