const createConstants = (...actions) => actions.reduce((acc, key) => ({...acc, [key]: key}), {})

export const pages = createConstants(
    'LANDING_PAGE',
    'CREATE_LOTTERY_PAGE',
    'JOIN_EXISTING_LOTTERY_PAGE'
)

export const actions = createConstants(
    'WEB3_REQUESTED',
    'WEB3_INJECTED',
    'SET_LOTTERY_STATE',
    'CREATE_LOTTERY_REQUESTED',
    'JOIN_EXISTING_LOTTERY_REQUESTED',
    'SET_LOTTERY_CONTRACT',
    'SHOW_ERROR'
)

// lotterypages should be exact copy of State enum in Lottery contract
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