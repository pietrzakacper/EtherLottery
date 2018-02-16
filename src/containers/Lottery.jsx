import React from 'react'

import {connect} from 'react-redux'
import {pages} from '../constants'

import Landing from './pages/Landing'
import CreateLottery from './pages/CreateLottery'
import WatingForOtherPlayerToJoin from './pages/WaitingForOtherPlayerToJoin'

const Lottery = ({page}) => {
    switch(page) {
        case pages.LANDING_PAGE:
            return <Landing/>
        case pages.CREATE_LOTTERY_PAGE:
            return <CreateLottery/>
        case pages.WAITING_FOR_OTHER_PLAYER_TO_JOIN:
            return <WatingForOtherPlayerToJoin/>
        default:
            return <p>No matching state for ({page})</p>
    }
}

export default connect(
    _ => ({
        page: _.get('page')
    })
)(Lottery)