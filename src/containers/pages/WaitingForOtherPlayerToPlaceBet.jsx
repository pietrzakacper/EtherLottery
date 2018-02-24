import React from 'react'

import {connect} from 'react-redux'

import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import { CircularProgress } from 'material-ui/Progress'
import Typography from 'material-ui/Typography'

import compose from 'lodash.compose'


const styles = theme => ({
    root: theme.mixins.gutters({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
        minHeight: '50%',
        width: '50%',
        padding: 10*theme.spacing.unit
    }),
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
    infoContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    firstMessage: {
        fontSize: '0.975rem',
        marginBottom: 16
    }
})


const WaitingForOtherUserToPlaceBetPage = ({classes, lotteryId}) => (
    <Paper className={classes.root} elevation={4}>
        <div className={classes.infoContainer}>
            <Typography className={classes.firstMessage}>
            Waiting for other player to place bet.
            </Typography>
        </div>
        <CircularProgress className={classes.progress} size={50} />
    </Paper>
)

export default compose(
    connect(
        _ => ({
            lotteryId : _.get('lotteryId')
        })
    ),
    withStyles(styles)
    )(WaitingForOtherUserToPlaceBetPage)