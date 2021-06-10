import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TasksList from '../components/TasksList'

const useStyles = makeStyles(() => ({
    homeContainer: {
        padding: 20
    }
}))

function Home() {
    const classes = useStyles()
    return (
        <div id="home" className={classes.homeContainer}>
            <TasksList  />
        </div>
    )
}

export default Home