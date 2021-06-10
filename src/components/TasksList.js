import { Grid, Typography, Button } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import instance from '../configs/axios'
import TaskListItem from './TaskListItem'
import CircularProgress from '@material-ui/core/CircularProgress'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'


function TasksList() {

    const [tasks, setTasks] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [sortDirection, setSortDirection] = useState('')
    const [sortField, setSortField] = useState('')

    useEffect(() => {
        fetchTasks()
    })

    const fetchTasks = () => {
        instance.get(`/?developer=Akylbek&sort_field=${sortField}&sort_direction=${sortDirection}&page=${page}`)
            .then((response) => {
                if(response.data.status === 'ok') {
                    setTasks(response.data.message.tasks)
                    setTotalCount(response.data.message.total_task_count)
                }
            })
    }

    return (
        <div id="tasks-table">
            <Grid 
                container
                justify="space-between"
                alignItems="center"
                direction="row"
            >
                <Grid item xs={3}>
                    <Typography variant="h2">Tasks ({totalCount})</Typography>
                </Grid>
                <Grid item container spacing={3} xs={9} direction="row" justify="space-between">
                    <Grid item xs={4} container spacing={1} alignItems="center">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => setSortField('id')} disabled={sortField === 'id' ? true : false}>ID</Button>  
                        </Grid>    
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => setSortField('username')} disabled={sortField === 'username' ? true : false}>Username</Button>  
                        </Grid>    
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => setSortField('email')} disabled={sortField === 'email' ? true : false}>Email</Button>  
                        </Grid>    
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => setSortField('status')} disabled={sortField === 'status' ? true : false}>Status</Button>  
                        </Grid>    
                    </Grid>
                    <Grid item container spacing={3} xs={2} alignItems="center">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => {setSortDirection('desc')}} disabled={ sortDirection === 'desc' ? true : false }>
                                <KeyboardArrowDownIcon />    
                            </Button>   
                        </Grid>    
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={() => {setSortDirection('asc')}} disabled={ sortDirection === 'asc' ? true : false }>
                                <KeyboardArrowUpIcon />    
                            </Button>  
                        </Grid>    
                    </Grid>
                    {
                        totalCount > 0 ?
                            <Grid item container xs={3} alignItems="center" spacing={3}>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={() => {setPage(page - 1)}} disabled={page === 1 ? true : false}>
                                        <ArrowBackIosIcon />
                                    </Button>  
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5">{page}</Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={() => {setPage(page + 1)}} disabled={ (page > Math.floor(totalCount / 3)) ? true : false } >
                                        <ArrowForwardIosIcon />
                                    </Button>  
                                </Grid>
                            </Grid>
                        : 
                            <></>
                    }
                </Grid>
            </Grid>
            
            <br /><br />
            
            <Grid container
                justify="center"
                alignItems="center"
            >
                {
                    tasks.length > 0 ?
                        tasks.map((task, i) => (
                            <Grid item xs={12} key={i}>
                                <TaskListItem taskItem={task} />
                            </Grid>
                        ))
                    :
                        <CircularProgress />
                }
            </Grid>
        </div>
    )
}

export default TasksList