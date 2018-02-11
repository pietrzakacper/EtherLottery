import React from 'react'

import {connect} from 'react-redux'
import {mapDispatchToProps} from '../../utils/reduxUtils'
import {createLotteryRequested, setLotteryState} from '../../actionCreators'

import {pages} from '../../constants'

import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Cancel from 'material-ui-icons/Cancel'
import Send from 'material-ui-icons/Send'
import Input, {InputAdornment} from 'material-ui/Input'
import {FormControl, FormHelperText} from 'material-ui/Form'
import Typography from 'material-ui/Typography'




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
    buttonsContainer: {
        marginTop: 3*theme.spacing.unit,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightButton: {
        marginLeft: 10*theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
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
    }
})


class CreateLotteryPage extends React.Component {
    state = {
        betAmount: ''
    }
    updateBetAmount = ({target}) => {
        this.setState({betAmount: target.value})
    }
    onCreateButtonClick = () => {
        this.props.actions.createLotteryRequested(
            Math.floor(this.state.betAmount)
        )
    }
    render() {
        const {classes, error, actions} = this.props
        const {betAmount} = this.state

        return (
        <Paper className={classes.root} elevation={4}>
            {error && <Typography className={classes.error}>{error}</Typography>}
            <Typography>
            Enter amount of Wei that you want to bet in your lottery.
            </Typography>
            <FormControl aria-describedby="weight-helper-text" className={classes.input}>
                <Input
                    autoFocus={true}
                    value={betAmount}
                    type="number"
                    onChange={this.updateBetAmount}
                    endAdornment={<InputAdornment position="end">Wei</InputAdornment>}
                />
                <FormHelperText id="weight-helper-text">Bet Amount</FormHelperText>
                </FormControl>
            <div className={classes.buttonsContainer}>
                <Button onClick={actions.showLandingPage} variant="raised" color="secondary">
                    Cancel
                    <Cancel className={classes.rightIcon} />
                </Button>
                <Button onClick={this.onCreateButtonClick}  className={classes.rightButton} variant="raised" color="primary">
                    Create
                    <Send className={classes.rightIcon}/>
                </Button>
                </div>
            </Paper>
        )
    }
}

export default compose(
    connect(
        _ => ({
            error: _.get('error')
        }),
        mapDispatchToProps({
            createLotteryRequested,
            showLandingPage: () => setLotteryState(pages.LANDING_PAGE)
        })
    ),
    withStyles(styles)
    )(CreateLotteryPage)