import {takeLatest} from 'redux-saga/effects'
import {actions} from '../constants'

import injectWeb3 from './injectWeb3'
import createLottery from './createLottery'
import joinLottery from './joinLottery'
import placeBet from './placeBet'
import revealBet from './revealBet'
import claimReward from './claimReward'

export default function* rootSaga() {
    yield takeLatest(actions.ETH_REQUESTED, injectWeb3)
    yield takeLatest(actions.CREATE_LOTTERY_REQUESTED, createLottery)
    yield takeLatest(actions.JOIN_LOTTERY_REQUESTED, joinLottery)
    yield takeLatest(actions.PLACE_BET_REQUESTED, placeBet)
    yield takeLatest(actions.REVEAL_BET_REQUESTED, revealBet)
    yield takeLatest(actions.CLAIM_REWARD_REQUESTED, claimReward)
}