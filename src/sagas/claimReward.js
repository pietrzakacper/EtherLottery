import {call, put, select} from 'redux-saga/effects'
import {promisify} from '../utils/ethUtils'
import {setPage} from '../actionCreators'
import {pages} from '../constants'

export default function* claimReward() {
    const {lotteryContract, eth, lotteryId} = yield select(store => store.toJS())

    const lotteryInstance = yield call(lotteryContract.deployed)
    const [userAccount] = yield call(eth.accounts)        

    yield call(lotteryInstance.claimPrize, lotteryId, {from: userAccount})
    yield call(promisify(lotteryInstance.PrizeClaimed), {lotteryId})

    yield put(setPage(pages.PRIZE_CLAIMED))
}