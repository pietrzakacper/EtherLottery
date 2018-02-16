import {actions} from './constants'

export const web3Requested = () => ({
    type: actions.WEB3_REQUESTED
})

export const web3Injected = web3 => ({
    type: actions.WEB3_INJECTED,
    web3
})

export const setPage = page => ({
    type: actions.SET_PAGE,
    page
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

export const setPageError = error => ({
    type: actions.SET_PAGE_ERROR,
    error
})

export const setLotteryId = id => ({
    type: actions.SET_LOTTERY_ID,
    id
})

export const setBetAmout = amount => ({
    type: actions.SET_BET_AMOUNT,
    amount
})