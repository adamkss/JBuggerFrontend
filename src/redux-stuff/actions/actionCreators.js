import { SET_BUGS, ADD_BUG, FILTER_BUGS, MOVE_BUG_VISUALLY, WAITING_FOR_BUG_UPDATE, SET_STATUSES, BUG_CLICKED, CLOSE_MODAL, SET_USER_NAMES, SET_BUG, UPDATE_CURRENTLY_ACTIVE_BUG, GET_LABELS, SET_LABELS, CREATE_SWIMLANE, REORDER_STATUSES, DELETE_SWIMLANE_WITH_BUGS, UPDATE_SWIMLANE_NAME, UPDATE_SWIMLANE_COLOR, CREATE_LABEL, DELETE_ATTACHMENT, ADD_ATTACHMENT_INFO, LOGIN_SUCCESSFULL, CLEAR_LOGIN_DATA, LOGIN_FAILED, TOKEN_EXPIRED } from './actionTypes'
import axios from 'axios';
import { local } from 'd3-selection';

export const setBugs = (bugs) => {
    return {
        type: SET_BUGS,
        data: bugs
    }
}

export const addBug = (newBug) => {
    return {
        type: ADD_BUG,
        newBug
    }
}

export const setStatuses = (statuses) => {
    return {
        type: SET_STATUSES,
        data: statuses
    }
}

export const setBugWithId = (modifedBug) => {
    return {
        type: SET_BUG,
        data: modifedBug
    }
}

export const getAllStatuses = () => {
    return (dispatch) => {
        axios.get('http://localhost:8080/statuses')
            .then(({ data }) => {
                dispatch(setStatuses(data))
                dispatch(getAllBugs())
            });
    }
}

export const getAllBugs = () => {
    return (dispatch) => {
        axios.get('http://localhost:8080/bugs')
            .then(({ data }) => dispatch(setBugs(data)));
    }
}

export const createBug = (newBugWithStatus) => {
    return (dispatch) => {
        axios.post('http://localhost:8080/bugs', newBugWithStatus)
            .then(({ data: createdBug }) => dispatch(addBug(createdBug)));
    }
}

export const filterBugs = (filterString) => {
    return {
        type: FILTER_BUGS,
        filterString
    }
}

export const moveBugVisually = (bugId, oldStatus, newStatus) => {
    return {
        type: MOVE_BUG_VISUALLY,
        data: {
            bugId,
            oldStatus,
            newStatus
        }
    }
}

export const waitingForBugUpdate = () => {
    return {
        type: WAITING_FOR_BUG_UPDATE
    }
}

export const moveBug = (bugId, oldStatus, newStatus) => {
    return (dispatch) => {
        dispatch(waitingForBugUpdate());
        axios.put(`http://localhost:8080/bugs/bug/${bugId}/status`, {
            newStatus
        }).then((result) => {
            dispatch(moveBugVisually(bugId, oldStatus, newStatus));
        }).catch((error) => {
            console.log(error);
        })
    }
}

export const bugClicked = (bugId) => {
    return {
        type: BUG_CLICKED,
        data: bugId
    }
}

export const closeModal = () => {
    return {
        type: CLOSE_MODAL
    }
}

export const setUserNames = (usernames) => {
    return {
        type: SET_USER_NAMES,
        data: usernames
    }
}

export const getUserNames = () => {
    return (dispatch) => {
        axios.get("http://localhost:8080/users/namesAndUsernames")
            .then(({ data }) => dispatch(setUserNames(data)))
    }
}

export const updateCurrentlyActiveBug = (newBug) => {
    return {
        type: UPDATE_CURRENTLY_ACTIVE_BUG,
        data: newBug
    }
}

export const startUpdatingBug = (modifiedBug) => {
    return (dispatch) => {
        axios.put(`http://localhost:8080/bugs/bug/${modifiedBug.id}`, modifiedBug)
            .then((result) => {
                dispatch(setBugWithId(result.data));
                dispatch(updateCurrentlyActiveBug(result.data))
            }).catch((error) => {
                console.log(error);
            })
    }
}

export const startUpdatingBugLabels = (bugId, aNewBugLabels) => {
    return (dispatch) => {
        axios.put(`http://localhost:8080/bugs/bug/${bugId}/labels`, {
            labelsName: aNewBugLabels
        })
            .then((result) => {
                dispatch(setBugWithId(result.data));
                dispatch(updateCurrentlyActiveBug(result.data))
            }).catch((error) => {
                console.log(error);
            })
    }
}

export const getLabels = () => {
    return (dispatch) => {
        axios.get("http://localhost:8080/labels")
            .then(({ data }) => dispatch(setLabels(data)));
    }
}

export const setLabels = (labels) => {
    return {
        type: SET_LABELS,
        data: labels
    }
}

export const startCreatingNewSwimLane = (swimLane) => {
    return (dispatch) => {
        axios.post('http://localhost:8080/statuses',
            {
                statusName: swimLane.swimLaneName,
                statusColor: swimLane.swimLaneColor
            }
        )
            .then(({ data: newSwimLane }) => dispatch(createNewSwimlane(newSwimLane)));
    }
}

export const createNewSwimlane = (newSwimLane) => {
    return {
        type: CREATE_SWIMLANE,
        data: newSwimLane
    }
}

export const reorderStatuses = (fromIndex, toIndex) => {
    return {
        type: REORDER_STATUSES,
        data: {
            fromIndex,
            toIndex
        }
    }
}

export const startDeletingSwimlane = (statusName) => {
    return (dispatch) => {
        axios.delete(`http://localhost:8080/statuses/${statusName}`)
            .then(() => dispatch(deleteSwimLane(statusName)))
            .catch(() => { });
    }
}

export const deleteSwimLane = (statusName) => {
    return {
        type: DELETE_SWIMLANE_WITH_BUGS,
        data: statusName
    }
}

export const startUpdatingSwimlaneName = (oldSwimLaneName, newSwimLaneName) => {
    return (dispatch) => {
        axios.put(`http://localhost:8080/statuses/${oldSwimLaneName}/name`, {
            statusName: newSwimLaneName
        }).then(() => {
            dispatch(updateSwimLaneName(oldSwimLaneName, newSwimLaneName))
        })
    }
}

export const updateSwimLaneName = (oldSwimLaneName, newSwimLaneName) => {
    return {
        type: UPDATE_SWIMLANE_NAME,
        data: {
            oldSwimLaneName,
            newSwimLaneName
        }
    }
}

export const startUpdatingSwimlaneColor = (swimlaneName, newSwimlaneColor) => {
    return (dispatch) => {
        axios.put(`http://localhost:8080/statuses/${swimlaneName}/color`, {
            statusColor: newSwimlaneColor
        }).then(() => {
            dispatch(updateSwimlaneColor(swimlaneName, newSwimlaneColor))
        })
    }
}

export const updateSwimlaneColor = (swimlaneName, newSwimlaneColor) => {
    return {
        type: UPDATE_SWIMLANE_COLOR,
        data: {
            swimlaneName,
            newSwimlaneColor
        }
    }
}

export const startCreatingNewLabel = (newLabelName, newLabelColor) => {
    return (dispatch) => {
        axios.post('http://localhost:8080/labels', {
            labelName: newLabelName,
            labelColor: newLabelColor
        })
            .then(({ data: newLabel }) => dispatch(createNewLabel(newLabel)));
    }
}

export const createNewLabel = (newLabel) => {
    return {
        type: CREATE_LABEL,
        data: newLabel
    }
}

export const startDeletingAttachment = (bugId, attachmentId) => {
    return (dispatch) => {
        axios.delete(`http://localhost:8080/attachments/attachment/${attachmentId}`)
            .then(() => dispatch(deleteAttachment(bugId, attachmentId)))
            .catch(() => { });
    }
}

export const deleteAttachment = (bugId, attachmentId) => {
    return {
        type: DELETE_ATTACHMENT,
        data: {
            bugId,
            attachmentId
        }
    }
}

export const addAttachmentInfo = (bugId, attachmentInfo) => {
    return {
        type: ADD_ATTACHMENT_INFO,
        data: {
            bugId,
            attachmentInfo
        }
    }
}

const getTokenExpiredCallback = dispatch => () => {
    localStorage.removeItem('token');
    dispatch(tokenExpired());
}

const setupLocalStorage = (token) => {
    localStorage.setItem('token', token);
}

const setupAxios = (token, tokenExpiredHandler) => {
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` };
    axios.interceptors.response.use(null, function (error) {
        if (error.status === 401) {
            tokenExpiredHandler();
        }
        return Promise.reject(error);
    });
}

export const tryInitializeSecurity = () => {
    return dispatch => {
        const existingToken = localStorage.getItem('token');
        if (existingToken) {
            axios.get("http://localhost:8080/users/user/current", {
                headers: {
                    "Authorization": `Bearer ${existingToken}`
                }
            }).then(({ data: loggedInUser }) => {
                setupLocalStorage(existingToken);
                setupAxios(existingToken, getTokenExpiredCallback());
                dispatch(loginSuccessfull(loggedInUser.username, existingToken))
            }).catch(() => {
                //empty localstorage and redirect to login
            })
        } else {
            //redirect to login
        }
    }
}

export const tryLogin = (isRememberMeNeeded, username, password, successCallback) => {
    return dispatch => {
        axios.post("http://localhost:8080/auth/signin", {
            username,
            password
        })
            .then(response => {
                if (isRememberMeNeeded)
                    setupLocalStorage(response.data.accessToken);

                setupAxios(response.data.accessToken, getTokenExpiredCallback(dispatch));

                dispatch(loginSuccessfull(username, response.data.accessToken));
                
                successCallback();
            })
            .catch(() => {
                dispatch(loginFailed())
            })
    }
}

export const loginSuccessfull = (username, token) => {
    return {
        type: LOGIN_SUCCESSFULL,
        data: {
            username,
            token
        }
    }
}

export const loginFailed = () => {
    return {
        type: LOGIN_FAILED
    }
}

export const announceTokenExpired = () => {
    return dispatch => {
        getTokenExpiredCallback(dispatch)();
    }
}

export const tokenExpired = () => {
    return {
        type: TOKEN_EXPIRED
    }
}

export const clearLoginData = () => {
    return {
        type: CLEAR_LOGIN_DATA
    }
}

export const logout = () => {
    return dispatch => {
        localStorage.clear();
        dispatch(clearLoginData());
    }
}