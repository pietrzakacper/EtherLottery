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
        height: '50%',
        width: '50%'
    }),
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
    infoContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    idContainer: {
        wordBreak: 'break-all',
        margin: 8,
        padding: 8,
        border: '1px solid black'
    },
    id: {
        fontSize: 18
    },
    firstMessage: {
        fontSize: '0.975rem',
        marginBottom: 16
    },
    secondMessage: {
        fontSize: '0.975rem'
    }
})


const WaitingForOtherUserToJoinPage = ({classes, lotteryId}) => (
    <Paper className={classes.root} elevation={4}>
        <div className={classes.infoContainer}>
            <Typography className={classes.firstMessage}>
            Waiting for other player to join lottery.
            </Typography>
            <Typography className={classes.secondMessage}>
            Provide him with the following lottery ID:
            </Typography>
        </div>
        <div className={classes.idContainer}>
            <Typography className={classes.id}>
                {lotteryId}
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
    )(WaitingForOtherUserToJoinPage)