import React,{useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import * as actions from '../../redux/actions/auth/authActions';
import _ from "lodash";

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // FixS IE 11 issue.
    marginTop: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  errorMessage: {
    color: "red",
    align: 'center'
  }
}));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const AdminLoginForm = (props) => {
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Varibales
  // ---------------------------------------------------------------------------
  
  // i) Material UI Hooks
  const classes = useStyles();

  // ii) React Hooks - States
  const [adminDetails, setAdminDetails] = useState({
    username: '',
    password: '',
  })
  const [doesAutheticationFailed, setDoesAutheticationFailed] = useState(false);
  const [firstLogInAttempt, setFirstLogInAttempt] = useState(true);
  
  // iii) Redux Hooks - Dispatchers
  const dispatch = useDispatch();
  const {authError} = useSelector(state =>  state.auth);
  
  // iv) React Hooks - Effects
  
  useEffect(() => {
    console.log(authError);
    if(!firstLogInAttempt && !_.isEmpty(authError)){
        setDoesAutheticationFailed(true);
    }
  },[authError]);

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleFormFieldChange = (e) => {
    setAdminDetails({...adminDetails, [e.target.name]: e.target.value})
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    dispatch(actions.authLogin(adminDetails.username, adminDetails.password))
    if(firstLogInAttempt)
      setFirstLogInAttempt(false);
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmitForm}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="User name"
            name="username"
            autoComplete="email"
            autoFocus
            onChange={handleFormFieldChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleFormFieldChange}
          />
          <Button
            className={classes.button}
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
          >
            Sign In
          </Button>
          {
            (doesAutheticationFailed) 
            ? 
              <p className={classes.errorMessage}>
                Invalid Credentials. Please try again
              </p>
            :
              ''
          }
        </form>
      </div>
    </Container>
  );
}

export default AdminLoginForm;
