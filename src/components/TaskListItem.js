import { Paper, makeStyles, Typography, Button, Grid, Checkbox, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import EditIcon from '@material-ui/icons/Edit'
import { useSelector } from 'react-redux'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import instance from '../configs/axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const useStyles = makeStyles(() => ({
    paper: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 50,
        paddingRight: 50,
        border: '2px solid royalblue',
        marginBottom: 25
    },
    typography: {
        marginTop: 15,
        marginBottom: 15
    },
    textField: {
        width: '100%'
    }
}))

function TaskListItem(props) {
    const classes = useStyles()

    const token = useSelector(state => state.auth.token)
    const [isEditing, setIsEditing] = useState(false)
    const [status, setStatus] = useState(props.taskItem.status)
    const [text, setText] = useState(props.taskItem.text)
    const [isLoading, setIsLoading] = useState(false)

    const showSwal = () => {
        MySwal.fire({
            title: <p>Login as admin to edit</p>,
            didOpen: () => {
              setTimeout(() => {
                MySwal.clickConfirm()
              }, 2000)
            }
        })
    }

    const handleChangeStatus = () => {
        setIsLoading(true)

        switch(status) {
            case 0: 
                setStatus(10)
                break

            case 1:
                setStatus(11)
                break

            case 10:
                setStatus(0)
                break

            case 11:
                setStatus(1)
                break 

            default:
                break
        }

        let fd = new FormData()
        fd.append('status', status)       
        fd.append('token', token) 

        instance.post(`/edit/${props.taskItem.id}?developer=Akylbek`, fd)
            .then(response => {
                console.log(response)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleSaveTask = () => {
        setIsLoading(true)

        switch(status) {
            case 0: 
                setStatus(1)
                break

            case 10:
                setStatus(11)
                break 

            default:
                break
        }

        let fd = new FormData()
        fd.append('text', text)
        fd.append('status', status)
        fd.append('token', token)

        instance.post(`/edit/${props.taskItem.id}?developer=Akylbek`, fd)
            .then(response => {
                console.log(response)
            })
            .finally(() => {
                setIsLoading(false)
                setIsEditing(false)
            })
    }

    return(
        <Paper variant="outlined" className={classes.paper}>
            <Grid 
                container
                justify="space-between"
                alignItems="center"
            >
                <Grid spacing={3} container justify="flex-start" alignItems="center" item xs={10}>
                    <Grid item>
                        <Typography className={classes.typography} variant="h4">
                            #{props.taskItem.id} / {props.taskItem.username}({props.taskItem.email})
                        </Typography>
                    </Grid>
                    <Grid item>
                        {
                            (status === 1 || status === 11) ?
                                <SupervisorAccountIcon />
                            :
                                <></>
                        }
                        {
                            token ?
                                <EditIcon onClick={() => setIsEditing(true)} />
                            :
                                <></>
                        }
                    </Grid>
                </Grid>
                <Grid container item xs={2} justify="flex-end" alignItems="center">
                    {
                        isLoading ?
                            <CircularProgress />
                        :
                            <Checkbox
                                checked={status === 11 || status === 10}
                                onChange={token ? handleChangeStatus : showSwal}
                            />
                    }
                </Grid>
            </Grid>
            {
                (token && isEditing) ?
                    <>
                        <TextField 
                            required 
                            multiline
                            rows={4}
                            type="text"
                            label="Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className={classes.textField}
                        />
                        <br /> <br />
                        <Button variant="contained" color="secondary" onClick={handleSaveTask}>
                            {
                                isLoading ?
                                    <CircularProgress />
                                : 
                                    'Save'
                            }
                        </Button>
                    </>
                :
                    <Typography className={classes.typography} variant="h5">
                        {props.taskItem.text}
                    </Typography> 
            }
        </Paper>
    )
}

export default TaskListItem