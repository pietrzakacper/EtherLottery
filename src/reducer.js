import {Map} from 'immutable'
import {actions} from './constants'

const defaultState = Map({
    web3: null,
    page: null,
    pageError: null,
    lotteryContract: null,
    lotteryId: null
})

const reducer = (state = defaultState, action) => {
    switch(action.type) {
        case actions.WEB3_INJECTED:
            return state.set('web3', action.web3)
        case actions.SET_PAGE:
            return state.merge({
                page: action.page,
                pageError: ''
            })
        case actions.SET_LOTTERY_CONTRACT:
            return state.set('lotteryContract', action.contract)
        case actions.SET_BET_AMOUNT:
            return state.set('betAmount', action.amount)
        case actions.SET_LOTTERY_ID:
            return state.set('lotteryId', action.id)
        case actions.SET_PAGE_ERROR:
            return state.set('pageError', action.error)
        default: 
            return state
    }
}

export default reducer