import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import LoginModal from './LoginModal'
import FormAddModal from './FormAddModal'
import { Grid } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        fontWeight: 700
    },
}))

function Navbar() {
    const classes = useStyles()

    return (
        <div id="navbar" className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Grid 
                        container
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item xs={10}>
                            <Typography variant="h6" className={classes.title}>
                                React Task Manager
                            </Typography>
                        </Grid>
                        <Grid item container xs={2} spacing={2}>                            
                            <Grid item>
                                <FormAddModal />
                            </Grid>
                            <Grid item>
                                <LoginModal />
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar