import { LOGIN_SUCCESSFULL } from "../actions/actionTypes";

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
        default: return state;
    }

}

export default securityReducer;