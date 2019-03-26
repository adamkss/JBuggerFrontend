import { LOGIN_SUCCESSFULL, CLEAR_LOGIN_DATA } from "../actions/actionTypes";

const JWTTokenLocalStorageMiddleware = (store) => (next) => (action) => {
    if (action.type === LOGIN_SUCCESSFULL) {
        localStorage.setItem('token', action.data.token);
    }
    if (action.type === CLEAR_LOGIN_DATA) {
        localStorage.removeItem('token');
    }
    return next(action);
}

export default JWTTokenLocalStorageMiddleware;