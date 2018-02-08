import React from 'react'

import AppBar from 'material-ui/AppBar';
import MUToolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const Toolbar = () => (
    <AppBar position="static" color="default">
        <MUToolbar>
            <Typography variant="title" color="inherit">
            EtherLottery
            </Typography>
        </MUToolbar>
    </AppBar>
)

export default Toolbar