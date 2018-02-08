import {call, put, takeLatest} from 'redux-saga/effects'
import getWeb3 from './utils/getWeb3'
import {web3Injected} from './actions'

function* injectWeb3() {
    const web3 = yield call(getWeb3)
    yield put(web3Injected(web3))
}

export default function* rootSaga() {
    yield takeLatest('WEB3_REQUESTED', injectWeb3)
}