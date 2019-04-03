import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import bugReducer from './redux-stuff/reducers/bugReducer';
import securityReducer from './redux-stuff/reducers/securityReducer';
import { BrowserRouter } from 'react-router-dom';

import thunk from 'redux-thunk';
import axios from 'axios';
import { announceTokenExpired } from './redux-stuff/actions/actionCreators';
import jwtDecode from 'jwt-decode';
import {getRolesFromInitialRole} from './utils/RolesHelper';
import {initialState} from './redux-stuff/reducers/securityReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const existingToken = localStorage.getItem('token');

let initialSecurityState = initialState;

if (existingToken) {
    initialSecurityState.loggedIn = true;
    initialSecurityState.token = existingToken;
    initialSecurityState.roles = jwtDecode(existingToken).roles;
    initialSecurityState = {
        ...initialSecurityState,
        ...getRolesFromInitialRole(initialSecurityState.roles[0])
    };

    axios.defaults.headers.common = { 'Authorization': `Bearer ${existingToken}` };
    axios.interceptors.response.use(null, function (error) {
        if (error.response.status === 401) {
            store.dispatch(announceTokenExpired());
            // window.location.pathname = "/login";
        }
        return Promise.reject(error);
    });
}


const rootReducer = combineReducers({
    bugs: bugReducer,
    security: securityReducer
});

const store = createStore(
    rootReducer,
    {
        security: initialSecurityState
    },
    composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
