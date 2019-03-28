import { LOGIN_SUCCESSFULL, CLEAR_LOGIN_DATA, LOGIN_FAILED, TOKEN_EXPIRED } from "../actions/actionTypes";

const securityReducer = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_SUCCESSFULL:
            return {
                ...state,
                loggedIn: true,
                username: action.data.username,
                token: action.data.token,
                isUsernameOrPasswordIncorrect: false,
                isTokenExpired: false
            }
        case CLEAR_LOGIN_DATA:
            return {
                ...state,
                loggedIn: false,
                username: null,
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
            return {
                ...state,
                loggedIn: false,
                username: null,
                token: null,
                isUsernameOrPasswordIncorrect: false,
                isTokenExpired: true
            }
        default: return state;
    }

}

export default securityReducer;