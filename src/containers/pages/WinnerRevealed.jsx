import React from 'react'

import {connect} from 'react-redux'
import {mapDispatchToProps} from '../../utils/reduxUtils'
import {claimRewardRequested} from '../../actionCreators'

import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Money from 'material-ui-icons/AttachMoney'
import Typography from 'material-ui/Typography'
import green from 'material-ui/colors/green'
import compose from 'lodash.compose'


const styles = theme => ({
    root: theme.mixins.gutters({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        minHeight: '50%',
        width: '50%',
        padding: 10*theme.spacing.unit
    }),
    header: {
      fontSize: '100%'  
    },
    buttonsContainer: {
        marginTop: 3*theme.spacing.unit,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    input: {
        marginTop: 5*theme.spacing.unit,
        margingBottom: 5*theme.spacing.unit
    },
    error: {
        color: theme.palette.error.main
    },
    button: {
        background: green[500],
        color: 'white'
    }
})


const WinnerPage = ({onClaimButtonClick, classes}) => (
    <div>
        <Typography>
        You won!
        </Typography>
        <div className={classes.buttonsContainer}>
            <Button onClick={onClaimButtonClick} variant="raised" className={classes.button}>
                Claim Reward
                <Money className={classes.rightIcon}/>
            </Button>
        </div>
    </div>
)

const LooserPage = () => (
    <Typography>
    You lost.
    </Typography>
)


const WinnerRevealedPage = ({classes, error, actions, isWinner}) => (
    <Paper className={classes.root} elevation={4}>
        {error && <Typography className={classes.error}>{error}</Typography>}
        {
        isWinner ?
            <WinnerPage onClaimButtonClick={actions.claimRewardRequested} classes={classes}/>:
            <LooserPage/>
        }
    </Paper>
)

export default compose(
    connect(
        _ => ({
            isWinner: _.get('isWinner')
        }),
        mapDispatchToProps({
            claimRewardRequested
        })
    ),
    withStyles(styles)
    )(WinnerRevealedPage)