import React from 'react'

import {connect} from 'react-redux'
import {mapDispatchToProps} from '../../utils/reduxUtils'
import {joinLotteryRequested, setPage} from '../../actionCreators'

import {pages} from '../../constants'

import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Cancel from 'material-ui-icons/Cancel'
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
    buttonsContainer: {
        marginTop: 3*theme.spacing.unit,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightButton: {
        marginLeft: 10*theme.spacing.unit,
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


class JoinLotteryPage extends React.Component {
    state = {
        lotteryId: ''
    }
    updateLotteryId = ({target}) => {
        this.setState({lotteryId: target.value})
    }
    onJoinButtonClick = () => {
        this.props.actions.joinLotteryRequested(
            this.state.lotteryId
        )
    }
    render() {
        const {classes, error, actions} = this.props
        const {lotteryId} = this.state

        return (
        <Paper className={classes.root} elevation={4}>
            {error && <Typography className={classes.error}>{error}</Typography>}
            <Typography>
            Enter your lotteryId.
            </Typography>
            <FormControl aria-describedby="weight-helper-text" className={classes.input}>
                <Input
                    autoFocus={true}
                    value={lotteryId}
                    type="text"
                    onChange={this.updateLotteryId}
                />
                <FormHelperText id="weight-helper-text">lotteryId</FormHelperText>
                </FormControl>
            <div className={classes.buttonsContainer}>
                <Button onClick={actions.showLandingPage} variant="raised" color="secondary">
                    Cancel
                    <Cancel className={classes.rightIcon} />
                </Button>
                <Button onClick={this.onJoinButtonClick}  className={classes.rightButton} variant="raised" color="primary">
                    Join
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
            joinLotteryRequested,
            showLandingPage: () => setPage(pages.LANDING)
        })
    ),
    withStyles(styles)
    )(JoinLotteryPage)