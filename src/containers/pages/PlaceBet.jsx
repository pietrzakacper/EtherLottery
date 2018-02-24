import React from 'react'

import {connect} from 'react-redux'
import {mapDispatchToProps} from '../../utils/reduxUtils'
import {placeBetRequested} from '../../actionCreators'

import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Send from 'material-ui-icons/Send'
import Input from 'material-ui/Input'
import {FormControl, FormHelperText} from 'material-ui/Form'
import Typography from 'material-ui/Typography'

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
    }
})


class PlaceBetPage extends React.Component {
    state = {
        betNumber: '',
        salt: ''
    }
    updateBetNumber = ({target}) => {
        this.setState({
            betNumber: Math.floor(target.value)
        })
    }
    updateSalt = ({target}) => {
        this.setState({salt: target.value})
    }
    onPlaceBetButtonClick = () => {
        this.props.actions.placeBetRequested(
            this.state.betNumber,
            this.state.salt
        )
    }
    render() {
        const {classes, error, otherPlayer} = this.props
        const {betNumber, salt} = this.state

        return (
        <Paper className={classes.root} elevation={4}>
            {error && <Typography className={classes.error}>{error}</Typography>}
            <Typography className={classes.header}>
            You're playing with "{otherPlayer}"
            </Typography>
            <Typography>
            In this lotterry phase you will actually send ether to the Smart Contract 
            along with a <strong>random integer</strong> and a <strong>salt</strong> (just a random text).
            </Typography>
            <Typography>
            You will need them later, so please put them down.
            </Typography>
            <FormControl aria-describedby="weight-helper-text" className={classes.input}>
                <Input
                    autoFocus={true}
                    value={betNumber}
                    type="number"
                    onChange={this.updateBetNumber}
                />
                <FormHelperText id="weight-helper-text">random number</FormHelperText>
            </FormControl>
            <FormControl aria-describedby="weight-helper-text" className={classes.input}>
                <Input
                    autoFocus={true}
                    value={salt}
                    type="text"
                    onChange={this.updateSalt}
                />
                <FormHelperText id="weight-helper-text">salt</FormHelperText>
            </FormControl>
            <div className={classes.buttonsContainer}>
                <Button onClick={this.onPlaceBetButtonClick} variant="raised" color="primary">
                    Place Bet
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
            error: _.get('pageError'),
            otherPlayer: _.get('otherPlayer')
        }),
        mapDispatchToProps({
            placeBetRequested
        })
    ),
    withStyles(styles)
    )(PlaceBetPage)