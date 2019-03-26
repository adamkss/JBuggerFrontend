import { LOGIN_SUCCESSFULL, CLEAR_LOGIN_DATA } from "../actions/actionTypes";

const initialState = {
    loggedIn: false,
    username: null,
    token: null
}

const securityReducer = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_SUCCESSFULL:
            return {
                ...state,
                loggedIn: true,
                username: action.data.username,
                token: action.data.token
            }
        case CLEAR_LOGIN_DATA:
            return {
                ...state,
                loggedIn: false,
                username: null,
                token: null
            }
        default: return state;
    }

}

export default securityReducer;