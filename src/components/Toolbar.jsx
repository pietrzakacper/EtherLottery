import React from 'react'

import {withStyles} from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import MUToolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import OkIcon from 'material-ui-icons/Done'
import NotOkIcon from 'material-ui-icons/Clear'

const styles = {
    flex: {
        flex: 1
    },
    center: {
        display: 'flex',
        alignItems: 'center'
    }
}

const Toolbar = ({ethLoaded, classes}) => (
    <AppBar position="static" color="default">
        <MUToolbar>
            <Typography variant="title" className={classes.flex}>
            EtherLottery
            </Typography>
            <Typography variant="subheading" className={classes.center}>
            Web3 injected:{' '}{ethLoaded ? <OkIcon/> : <NotOkIcon/>}
            </Typography>
        </MUToolbar>
    </AppBar>
)

export default withStyles(styles)(Toolbar)