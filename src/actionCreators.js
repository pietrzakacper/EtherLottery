import {actions} from './constants'

export const web3Requested = () => ({
    type: actions.WEB3_REQUESTED
})

export const web3Injected = web3 => ({
    type: actions.WEB3_INJECTED,
    web3
})

export const setLotteryState = state => ({
    type: actions.SET_LOTTERY_STATE,
    state
})

export const createLotteryRequested = betAmount => ({
    type: actions.CREATE_LOTTERY_REQUESTED,
    betAmount
})

export const joinExistingLotteryRequested = () => ({
    type: actions.JOIN_EXISTING_LOTTERY_REQUESTED
})

export const setLotteryContract = contract => ({
    type: actions.SET_LOTTERY_CONTRACT,
    contract
})

export const showError = msg => ({
    type: actions.SHOW_ERROR,
    msg
})