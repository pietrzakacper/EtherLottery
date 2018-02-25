import React from 'react'

import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'


const styles = theme => ({
    error: {
        color: theme.palette.error.main
    },
})

const WinnerRevealedPage = ({classes, error, actions, isWinner}) => (
    <Paper className={classes.root} elevation={4}>
        {error && <Typography className={classes.error}>{error}</Typography>}
        <Typography>
            You have succesfully claimed your prize!
        </Typography>
    </Paper>
)

export default withStyles(styles)(WinnerRevealedPage)