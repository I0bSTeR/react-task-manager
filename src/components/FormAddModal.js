import React, { useRef, useState } from 'react'
import { Fade, Backdrop, TextField, makeStyles, Button, CircularProgress, Modal } from '@material-ui/core'
import instance from '../configs/axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const useStyles = makeStyles(() => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalInner: {
        backgroundColor: '#fff',
        padding: 50,
        maxWidth: 700,
        width: '100%'
    },
    modalHeading: {
        marginBottom: 20
    },
    formGroup: {
        width: '100%',
        marginTop: 20,
        marginBottom: 20
    },
    buttonContainer: {
        width: '100%',
        textAlign: 'center'
    },
    formButton: {
        marginTop: 20,
        width: '50%'
    }
}))

function FormAddModal() {
    const classes = useStyles()
    const modalRef = useRef()

    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [text, setText] = useState('')
    const [error, setError] = useState({username: {status: false, text: ''}, email: {status: false, text: ''}, text: {status: false, text: ''}})

    const validateForm = () => {
        setError({username: {status: false, text: ''}, email: {status: false, text: ''}, text: {status: false, text: ''}})

        if(username === '') {
            setError({...error, 
                username: {
                    status: true,
                    text: 'Username is required'
                }
            })
    
            return false
        }
    
        if(email === '') {
            setError({...error, 
                email: {
                    status: true,
                    text: 'Email is required'
                }
            })
    
            return false
        }

        if(text === '') {
            setError({...error, 
                text: {
                    status: true,
                    text: 'Text is required'
                }
            })
    
            return false
        }
    
        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(validateForm()) {
            setIsLoading(true)

            let fd = new FormData()
            fd.append('username', username)
            fd.append('email', email)
            fd.append('text', text)
    
            instance.post('/create?developer=Akylbek', fd)
                .then(response => {
                    if(response.data.status === 'ok') {
                        MySwal.fire({
                            title: <p>Task added succesfully</p>,
                            didOpen: () => {
                              setTimeout(() => {
                                MySwal.clickConfirm()
                              }, 2000)
                            }
                          })

                        setUsername('')
                        setEmail('')
                        setText('')
                        setOpen(false)
                        
                        return false
                    } else {
                        if(response.data.message.username) {
                            setError({...error, 
                                username: {
                                    status: true,
                                    text: response.data.message.username
                                }
                            })
                        }
    
                        if(response.data.message.email) {
                            setError({...error, 
                                email: {
                                    status: true,
                                    text: response.data.message.email
                                }
                            })
                        }
                        if(response.data.message.text) {
                            setError({...error, 
                                text: {
                                    status: true,
                                    text: response.data.message.text
                                }
                            })
                        }
                    }
                })
                .finally(() => setIsLoading(false))    
        }

        return false
    }


    return (
        <div id="form-add-modal">    
            <Button variant="contained" color="secondary" onClick={() => {setOpen(true)}}>
                Add task
            </Button>

            <Modal
                ref={(node) => {
                    modalRef.current = node;
                }}
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                >
                <Fade in={open}>
                    <div className={classes.modalInner}>
                    <div className={classes.modalHeading}>
                        <h2 id="transition-modal-title">Add task</h2>
                        <p id="transition-modal-description">Use this form to add task</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className={classes.modalForm} >
                        <TextField 
                            error={error.username.status}
                            helperText={error.username.text}
                            type="text"
                            label="Username" 
                            className={classes.formGroup}
                            required
                            value={username}
                            onChange={(e) => {setUsername(e.target.value)}}
                        />
                        <TextField 
                            error={error.email.status}
                            helperText={error.email.text}
                            type="email"
                            label="Email"
                            required 
                            className={classes.formGroup}
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                        <TextField 
                            error={error.text.status}
                            helperText={error.text.text}
                            type="text"
                            label="Text"
                            required 
                            multiline
                            rows={4}
                            className={classes.formGroup}
                            value={text}
                            onChange={(e) => {setText(e.target.value)}}
                        />

                        <div className={classes.buttonContainer}>
                            <Button 
                                type="submit"
                                variant="contained" 
                                color="primary"
                                className={classes.formButton} 
                                disabled={isLoading}
                            >
                                {
                                    isLoading ?
                                        <CircularProgress color="secondary" />
                                    :
                                        'Add task'
                                }
                            </Button>
                        </div>
                    </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default FormAddModal