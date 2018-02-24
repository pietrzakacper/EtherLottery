import React from 'react'

import {connect} from 'react-redux'
import {pages} from '../constants'

import Landing from './pages/Landing'
import CreateLottery from './pages/CreateLottery'
import WatingForOtherPlayerToJoin from './pages/WaitingForOtherPlayerToJoin'
import JoinLottery from './pages/JoinLottery'
import PlaceBet from './pages/PlaceBet'

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
        default:
            return <p>No matching state for ({page})</p>
    }
}

export default connect(
    _ => ({
        page: _.get('page')
    })
)(Lottery)