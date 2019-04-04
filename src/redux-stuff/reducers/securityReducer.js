import { LOGIN_SUCCESSFULL, CLEAR_LOGIN_DATA, LOGIN_FAILED, TOKEN_EXPIRED } from "../actions/actionTypes";
import { getRolesFromInitialRole } from '../../utils/RolesHelper';
import jwtDecode from 'jwt-decode';

export const getInitialState = () => ({
    loggedIn: false,
    username: null,
    loggedInUserName: null,
    token: null,
    isUsernameOrPasswordIncorrect: false,
    isTokenExpired: false,
    roles: [],
    isAdmin: false,
    isPM: false,
    isTM: false,
    isDev: false,
    isTester: false,
    predefinedRoles: ["ROLE_TEST", "ROLE_DEV", "ROLE_TM", "ROLE_PM", "ROLE_ADM"]
});

const securityReducer = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_SUCCESSFULL:
            const roles = jwtDecode(action.data.token).roles;
            return {
                ...state,
                loggedIn: true,
                username: action.data.username,
                loggedInUserName: action.data.loggedInUserName,
                token: action.data.token,
                isUsernameOrPasswordIncorrect: false,
                isTokenExpired: false,
                roles,
                ...getRolesFromInitialRole(roles[0])
            }
        case CLEAR_LOGIN_DATA:
            return {
                ...state,
                loggedIn: false,
                username: null,
                loggedInUserName: null,
                token: null,
                isUsernameOrPasswordIncorrect: false,
                isTokenExpired: false
            }
        case LOGIN_FAILED:
            return {
                ...state,
                isUsernameOrPasswordIncorrect: true,
                isTokenExpired: false
            }
        case TOKEN_EXPIRED:
            return getInitialState();
        default: return state;
    }

}

export default securityReducer;