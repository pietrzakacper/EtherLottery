import {call, put, takeLatest, select} from 'redux-saga/effects'
import getWeb3 from './utils/getWeb3'
import {web3Injected, setLotteryState, setLotteryContract, showError} from './actionCreators'
import {actions, pages, lotteryStates} from './constants'

import Lottery from '../build/contracts/LotteryHelper.json'
import contract from 'truffle-contract'

function* injectWeb3() {
    const {web3} = yield call(getWeb3)
    yield put(web3Injected(web3))

    const lotteryContract = yield call(contract, Lottery)
    lotteryContract.setProvider(web3.currentProvider)
    
    
    yield put(setLotteryContract(lotteryContract))

    yield put(setLotteryState(pages.LANDING_PAGE))
}

const getUserAccount = async web3 => new Promise(
    (res, rej) => {
        web3.eth.getAccounts((err, accounts) => {
            if(err) {
                rej(err)
                return
            }
               
            res(accounts[0])
        })
    }
)

function* createNewLottery(betAmount) {
    const lotteryContract = yield select(_ => _.get('lotteryContract'))
    const web3 = yield select(_ => _.get('web3'))
    
    const lotteryInstance = yield call(lotteryContract.deployed)
    const userAccount = yield call(getUserAccount, web3)
    const lotteryState = yield call(lotteryInstance.getLotteryState.call, userAccount)

    if(lotteryState !== lotteryStates.UNINITIALIZED) {
        yield put(showError(
            `You've already created a lottery.
             Join your lottery using your accounts address: "${userAccount}"`
        ))
        return
    }

    yield call(lotteryInstance.createLottery, betAmount)
}

export default function* rootSaga() {
    yield takeLatest(actions.WEB3_REQUESTED, injectWeb3)
    yield takeLatest(actions.CREATE_LOTTERY_REQUESTED, createNewLottery)
}