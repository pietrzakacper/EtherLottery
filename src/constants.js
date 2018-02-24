const createConstants = (...actions) => actions.reduce((acc, key) => ({...acc, [key]: key}), {})

export const pages = createConstants(
    'LANDING',
    'CREATE_LOTTERY',
    'JOIN_LOTTERY',
    'WAITING_FOR_OTHER_PLAYER_TO_JOIN',
    'PLACE_BET',
    'WAITING_FOR_OTHER_PLAYER_TO_PLACE_BET',
    'REVEAL_BET'
)

export const actions = createConstants(
    'ETH_REQUESTED',
    'ETH_INJECTED',
    'CREATE_LOTTERY_REQUESTED',
    'JOIN_LOTTERY_REQUESTED',
    'SET_LOTTERY_CONTRACT',
    'SET_LOTTERY_ID',
    'SET_PAGE_ERROR',
    'SET_BET_AMOUNT',
    'SET_PAGE',
    'CHANGE_PAGE_TO_PLACE_BETS',
    'PLACE_BET_REQUESTED',
    'CHANGE_PAGE_TO_WAIT_FOR_OTHER_PLAYER_TO_JOIN'
)

// lotteryStates should be exact copy of State enum in Lottery contract
export const lotteryStates = createConstants(
    'UNINITIALIZED',
    'LOTTERY_CREATED',
    'PLACING_BETS',
    'WITHDRAWING_FUNDS_AFTER_ONE_BET',
    'REVEALING_BETS',
    'WITHDRAWING_FUNDS_AFTER_ONE_REVEAL',
    'REVEALING_WINNER',
    'CLAIMING_PRIZE',
    'LOTTERY_ENDED'
) 