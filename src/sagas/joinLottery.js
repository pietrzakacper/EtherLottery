import {call, put, select} from 'redux-saga/effects'
import {setPageError, changePageToPlaceBets} from '../actionCreators'
import {lotteryStates} from '../constants'

export default function* joinLottery({lotteryId}) {
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