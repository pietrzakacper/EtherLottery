import {call, put} from 'redux-saga/effects'
import {getEth} from '../utils/ethUtils'
import {ethInjected, setPage, setLotteryContract} from '../actionCreators'
import {pages} from '../constants'

import Lottery from '../../build/contracts/LotteryHelper.json'
import contract from 'truffle-contract'


export default function* injectWeb3() {
    const {eth} = yield call(getEth)
    yield put(ethInjected(eth))

    const lotteryContract = yield call(contract, Lottery)
    lotteryContract.setProvider(eth.currentProvider)
    
    yield put(setLotteryContract(lotteryContract))

    yield put(setPage(pages.LANDING))
}