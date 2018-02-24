import {call, put, select} from 'redux-saga/effects'
import {promisify} from '../utils/ethUtils'
import {setPage, changePageToWinnerRevealed} from '../actionCreators'
import {pages, lotteryStates} from '../constants'

export default function* revealBet({userNumber, salt}) {
    const {lotteryContract, eth, lotteryId, otherPlayer} = yield select(store => store.toJS())

    const lotteryInstance = yield call(lotteryContract.deployed)
    const [userAccount] = yield call(eth.accounts)        

    yield call(lotteryInstance.revealBet, lotteryId, salt, userNumber, {from: userAccount})
    
    const lotteryState = yield call(lotteryInstance.getLotteryState.call, lotteryId)

    if(lotteryState === lotteryStates.REVEALING_BETS) {
        yield put(setPage(pages.WAITING_FOR_OTHER_PLAYER_TO_REVEAL_BET))
    }

    const {args: {user: winner}} = yield call(promisify(lotteryInstance.WinnerRevealed), {lotteryId})

    const isWinner = winner !== otherPlayer

    yield put(changePageToWinnerRevealed(isWinner))
}