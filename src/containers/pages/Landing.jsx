import React from 'react'

import {connect} from 'react-redux'
import {mapDispatchToProps} from '../../utils/reduxUtils'
import {setPage} from '../../actionCreators'

import {pages} from '../../constants'

import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'

import compose from 'lodash.compose'


const styles = theme => ({
    root: theme.mixins.gutters({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '50%',
        width: '50%'
    }),
    button1: {
        width: 280,
        height: 70
    },
    button2: {
        width: 280,
        height: 70,
        marginTop: 40
    }
})

const LandingPage = ({classes, actions}) => (
    <Paper className={classes.root} elevation={4}>
        <Button onClick={actions.showCreateLotteryPage} size="large" color="primary" className={classes.button1}>
          Create a new lottery
        </Button>
        <Button onClick={actions.showJoinLotteryPage} size="large" color="secondary" className={classes.button2}>
          Join an existing lottery
        </Button>
    </Paper>
)

export default compose(
    connect(null,
        mapDispatchToProps({
            showCreateLotteryPage: () => setPage(pages.CREATE_LOTTERY),
            showJoinLotteryPage: () => setPage(pages.JOIN_LOTTERY)
        })
    ),
    withStyles(styles)
    )(LandingPage)