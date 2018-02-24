import {call, put, select} from 'redux-saga/effects'
import {promisify} from '../utils/ethUtils'
import {setPage} from '../actionCreators'
import {pages, lotteryStates} from '../constants'

import sha3 from 'solidity-sha3'

export default function* placeBet({userNumber, salt}) {
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