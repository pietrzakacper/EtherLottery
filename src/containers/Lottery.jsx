import React from 'react'

import {connect} from 'react-redux'
import {pages} from '../constants'

import Landing from './pages/Landing'
import CreateLottery from './pages/CreateLottery'
import WatingForOtherPlayerToJoin from './pages/WaitingForOtherPlayerToJoin'
import JoinLottery from './pages/JoinLottery'
import PlaceBet from './pages/PlaceBet'
import WaitingForOtherPlayerToPlaceBet from './pages/WaitingForOtherPlayerToPlaceBet'
import RevealBet from './pages/RevealBet'
import WaitingForOtherPlayerToRevealBet from './pages/WaitingForOtherPlayerToRevealBet'

const Lottery = ({page}) => {
    switch(page) {
        case pages.LANDING:
            return <Landing/>
        case pages.CREATE_LOTTERY:
            return <CreateLottery/>
        case pages.JOIN_LOTTERY:
            return <JoinLottery/>
        case pages.WAITING_FOR_OTHER_PLAYER_TO_JOIN:
            return <WatingForOtherPlayerToJoin/>
        case pages.PLACE_BET:
            return <PlaceBet/>
        case pages.WAITING_FOR_OTHER_PLAYER_TO_PLACE_BET:
            return <WaitingForOtherPlayerToPlaceBet/>
        case pages.REVEAL_BET:
            return <RevealBet/>
        case pages.WAITING_FOR_OTHER_PLAYER_TO_REVEAL_BET:
            return <WaitingForOtherPlayerToRevealBet/>

            // TODO handle WinnerRevealed
        default:
            return <p>No matching state for ({page})</p>
    }
}

export default connect(
    _ => ({
        page: _.get('page')
    })
)(Lottery)