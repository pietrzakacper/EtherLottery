import {Map} from 'immutable'
import {actions} from './constants'

const defaultState = Map({
    web3: null,
    lotteryState: null,
    lotteryContract: null,
    error: null,
})

const reducer = (state = defaultState, action) => {
    switch(action.type) {
        case actions.WEB3_REQUESTED:
            return state
        case actions.WEB3_INJECTED:
            return state.set('web3', action.web3)
        case actions.SET_LOTTERY_STATE:
            return state.set('lotteryState', action.state)
        case actions.SET_LOTTERY_CONTRACT:
            return state.set('lotteryContract', action.contract)
        case actions.SHOW_ERROR:
            return state.set('error', action.msg)
        default: 
            return state
    }
}

export default reducer