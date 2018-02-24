import {Map} from 'immutable'
import {actions, pages} from './constants'

const defaultState = Map({
    eth: null,
    page: null,
    pageError: null,
    lotteryContract: null,
    betAmount: null,
    lotteryId: null,
    otherPlayer: null
})

const reducer = (state = defaultState, action) => {
    switch(action.type) {
        case actions.ETH_INJECTED:
            return state.set('eth', action.eth)

        case actions.SET_PAGE:
            return state.merge({
                page: action.page,
                pageError: ''
            })

        case actions.SET_LOTTERY_CONTRACT:
            return state.set('lotteryContract', action.contract)

        case actions.SET_PAGE_ERROR:
            return state.set('pageError', action.error)

        case actions.CHANGE_PAGE_TO_WAIT_FOR_OTHER_PLAYER_TO_JOIN:
            return state.merge({
                lotteryId: action.lotteryId,
                page: pages.WAITING_FOR_OTHER_PLAYER_TO_JOIN
            })

        case actions.CHANGE_PAGE_TO_PLACE_BETS:
            return state.merge({
                otherPlayer: action.otherPlayer,
                lotteryId: action.lotteryId,
                betAmount: action.betAmount,
                page: pages.PLACE_BET
            })

        case actions.CHANGE_PAGE_TO_WINNER_REVEALED:
            return state.merge({
                isWinner: actions.isWinner,
                page: pages.WINNER_REVEALED
            })
            
        default: 
            return state
    }
}

export default reducer