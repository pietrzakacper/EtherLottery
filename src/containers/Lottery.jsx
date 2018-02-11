import React from 'react'

import {connect} from 'react-redux'
import {pages} from '../constants'

import Landing from './pages/Landing'
import CreateLottery from './pages/CreateLottery'


const Lottery = ({lotteryState}) => {
    switch(lotteryState) {
        case pages.LANDING_PAGE:
            return <Landing/>
        case pages.CREATE_LOTTERY_PAGE:
            return <CreateLottery/>
        default:
            return <p>No matching state for ({lotteryState})</p>
    }
}

export default connect(
    _ => ({
        lotteryState: _.get('lotteryState')
    })
)(Lottery)