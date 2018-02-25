import {actions} from './constants'

export const ethRequested = () => ({
    type: actions.ETH_REQUESTED
})

export const ethInjected = eth => ({
    type: actions.ETH_INJECTED,
    eth
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

export const changePageToWaitForOtherPlayerToJoin = lotteryId => ({
    type: actions.CHANGE_PAGE_TO_WAIT_FOR_OTHER_PLAYER_TO_JOIN,
    lotteryId
})

export const joinLotteryRequested = lotteryId => ({
    type: actions.JOIN_LOTTERY_REQUESTED,
    lotteryId
})

export const changePageToPlaceBets = (otherPlayer, lotteryId, betAmount) => ({
    type: actions.CHANGE_PAGE_TO_PLACE_BETS,
    otherPlayer, lotteryId, betAmount
})

export const placeBetRequested = (userNumber, salt) => ({
    type: actions.PLACE_BET_REQUESTED,
    userNumber, salt
})

export const revealBetRequested = (userNumber, salt) => ({
    type: actions.REVEAL_BET_REQUESTED,
    userNumber, salt
})

export const changePageToWinnerRevealed = isWinner => ({
    type: actions.CHANGE_PAGE_TO_WINNER_REVEALED,
    isWinner
})

export const claimRewardRequested = () => ({
    type: actions.CLAIM_REWARD_REQUESTED
})