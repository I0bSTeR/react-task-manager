import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import AccountCircle from '@material-ui/icons/AccountCircle'
import VpnKey from '@material-ui/icons/VpnKey'
import InputAdornment from '@material-ui/core/InputAdornment'
import instance from '../configs/axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useDispatch } from 'react-redux'
import { saveToken, removeToken } from '../store/slices/authSlice' 

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
  }));
  
function LoginModal() {
    const classes = useStyles()
    const modalRef = useRef();

    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false)
    const [isAuthed, setAuth] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({username: {status: false, text: ''}, password: {status: false, text: ''}})
    const [isLoading, setIsLoading] = useState(false)

    const handleOpen = () => {
      setOpen(true)
    }
  
    const handleClose = () => {
      setOpen(false)
    }

    const handleLogout = () => {
      dispatch(removeToken())
      
      setUsername('')
      setPassword('')
      setAuth(false)
    }

    const validateForm = () => {
      // reset validation
      setError({username: {status: false, text: ''}, password: {status: false, text: ''}})

      if(username === '') {
        setError({...error, 
          username: {
            status: true,
            text: 'Username is required'
          }
        })

        return false
      }

      if(password === '') {
        setError({...error, 
          password: {
            status: true,
            text: 'Password is required'
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
 
        const params = new URLSearchParams()
        params.append('username', username)
        params.append('password', password)

        instance.post('/login?developer=Akylbek', params)
          .then(response => {
            if(response.data.status === 'ok') {
              dispatch(saveToken(response.data.message.token))

              setOpen(false)
              setAuth(true)
            } else {
              setError({...error, 
                username: {
                  status: true,
                  text: response.data.message.username
                },
                password: {
                  status: true,
                  text: response.data.message.password
                }
              })
            }
          })
          .finally(() => {
            setIsLoading(false)
          })

      }
    }
    
  
    return (
      <div>
        <Button variant="contained" color="secondary" onClick={ isAuthed ? handleLogout : handleOpen }>
          {
            isAuthed ?
              'Logout(admin)'
            :
              'Login'
          }
        </Button>

        <Modal
          ref={modalRef}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.modalInner}>
              <div className={classes.modalHeading}>
                <h2 id="transition-modal-title">Login</h2>
                <p id="transition-modal-description">Use this form to login as administrator</p>
              </div>
              
              <form onSubmit={handleSubmit} className={classes.modalForm} >
                <TextField 
                  error={error.username.status}
                  helperText={error.username.text}
                  type="text"
                  label="Username" 
                  className={classes.formGroup}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }} 
                  value={username}
                  onChange={(e) => {setUsername(e.target.value)}}
                />
                <TextField 
                  error={error.password.status}
                  helperText={error.password.text}
                  type="password"
                  label="Password"
                  required 
                  className={classes.formGroup}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKey />
                      </InputAdornment>
                    ),
                  }}
                  value={password}
                  onChange={(e) => {setPassword(e.target.value)}}
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
                        'Login'
                    }
                  </Button>
                </div>
              </form>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }

export default LoginModal