import React, { Component } from 'react';
import './App.css';
import 'typeface-roboto';
import Login from './Login';
import Home from './Home';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { purple, indigo, blueGrey } from '@material-ui/core/colors';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom'

const theme = createMuiTheme({
  palette: {
    primary: { main: purple[900] }, // Purple and green play nicely together.
    secondary: { main: purple[100] }, // This is just green.A700 as hex.
    bugsColumnColors: {
      "New": purple[300],
      "In progress": purple[400],
      "Fixed": purple[500],
      "Closed": indigo[300],  
      "Rejected": indigo[400],
      "Info needed": indigo[500]
    }
  },
  
  grow: {
    flexGrow: 1
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.loginSuccesful = this.loginSuccesful.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  state = {
    // TODO: In production this is initially false
    loggedIn: true
  }

  loginSuccesful() {
    this.setState({
      loggedIn: true
    })
  }

  onLogout() {
    this.setState({
      loggedIn: false
    })
  }

  render() {
    const { location } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/login' render={(props) => (
              <Login onLogin={this.loginSuccesful} />
            )} />
            <PrivateRoute path='/' loggedIn={this.state.loggedIn} component={Home} onLogout={this.onLogout} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const PrivateRoute = ({ component: Component, loggedIn, onLogout, ...rest }) => (
  <Route {...rest} render={(props) => (
    loggedIn === true
      ? <Component {...props} onLogout={onLogout} />
      : <Redirect to='/login' />
  )} />
)

export default App;
