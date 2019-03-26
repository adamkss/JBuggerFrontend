import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import './Login.css';
import love from './assets/love.png';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Login extends React.Component {
  state = {
    didAppear: false,
    isLoveNeeded: false
  }
  componentDidMount = () => {
    this.setState({
      didAppear: true
    })
  }

  onMottoClicked = () => {
    this.setState({
      isLoveNeeded: true
    });
    setTimeout(() => {
      this.setState({
        isLoveNeeded: false
      })
    }, 1000)
  }

  render() {
    const { classes } = this.props;
    const loginBoxPositionCSSClass = this.state.didAppear ? "login__login-box-normal" : "login__login-box-initial";
    const mottoCSSClass = this.state.didAppear ? "footer__motto-end-state" : "footer__motto-initial-state";

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={"login-wrapper"}>
          <div className={"login__login-box " + loginBoxPositionCSSClass}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
          </Typography>
              <form className={classes.form}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <Input id="email" name="email" autoComplete="email" autoFocus />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    name="password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => { this.props.onLogin(); this.props.history.push('/'); }}
                >
                  Sign in
            </Button>
              </form>
            </Paper>
          </div>
          <footer className="login__footer">
            <span className={"login__footer__motto " + mottoCSSClass} onClick={this.onMottoClicked}>
              Crafted by KA.
            </span>
            <div className="login__love-wrapper">
              {this.state.isLoveNeeded ?
                <img src={love} className="login__love" />
                :
                null
              }
            </div>
          </footer>
        </main>
      </React.Fragment>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Login));