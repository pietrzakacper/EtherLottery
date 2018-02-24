import React from 'react'

import {connect} from 'react-redux'
import {mapDispatchToProps} from '../../utils/reduxUtils'
import {revealBetRequested} from '../../actionCreators'

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


class RevealBetPage extends React.Component {
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
        this.props.actions.revealBetRequested(
            this.state.betNumber,
            this.state.salt
        )
    }
    render() {
        const {classes, error} = this.props
        const {betNumber, salt} = this.state

        return (
        <Paper className={classes.root} elevation={4}>
            {error && <Typography className={classes.error}>{error}</Typography>}
            <Typography>
            Alrgiht, now when both of you have placed their bets it is time to reveal them.
            </Typography>
            <Typography>
            Please type the exact same <strong>number</strong> and <strong>salt</strong> as before.
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
                    Reveal Bet
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
            error: _.get('pageError')
        }),
        mapDispatchToProps({
            revealBetRequested
        })
    ),
    withStyles(styles)
    )(RevealBetPage)