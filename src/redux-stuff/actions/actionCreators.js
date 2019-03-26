import { SET_BUGS, ADD_BUG, FILTER_BUGS, MOVE_BUG_VISUALLY, WAITING_FOR_BUG_UPDATE, SET_STATUSES, BUG_CLICKED, CLOSE_MODAL, SET_USER_NAMES, SET_BUG, UPDATE_CURRENTLY_ACTIVE_BUG, GET_LABELS, SET_LABELS, CREATE_SWIMLANE, REORDER_STATUSES, DELETE_SWIMLANE_WITH_BUGS, UPDATE_SWIMLANE_NAME, UPDATE_SWIMLANE_COLOR, CREATE_LABEL, DELETE_ATTACHMENT, ADD_ATTACHMENT_INFO } from './actionTypes'
import axios from 'axios';

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
        fetch('http://localhost:8080/statuses')
            .then((response) => response.json())
            .then((response) => {
                dispatch(setStatuses(response))
                dispatch(getAllBugs())
            });
    }
}

export const getAllBugs = () => {
    return (dispatch) => {
        fetch('http://localhost:8080/bugs')
            .then((response) => response.json())
            .then((allBugs) => dispatch(setBugs(allBugs)));
    }
}

export const createBug = (newBugWithStatus) => {
    return (dispatch) => {
        fetch('http://localhost:8080/bugs', {
            method: "POST",
            body: JSON.stringify(newBugWithStatus),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then((createdBug) => dispatch(addBug(createdBug)));
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
        fetch("http://localhost:8080/users/namesAndUsernames")
            .then((response) => response.json())
            .then((users) => dispatch(setUserNames(users)))
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
        fetch("http://localhost:8080/labels")
            .then(response => response.json())
            .then(responseJSON => dispatch(setLabels(responseJSON)));
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
        fetch('http://localhost:8080/statuses', {
            method: "POST",
            body: JSON.stringify({
                statusName: swimLane.swimLaneName,
                statusColor: swimLane.swimLaneColor
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then((newSwimLane) => dispatch(createNewSwimlane(newSwimLane)));
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
        fetch('http://localhost:8080/labels', {
            method: "POST",
            body: JSON.stringify({
                labelName: newLabelName,
                labelColor: newLabelColor
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then((newLabel) => dispatch(createNewLabel(newLabel)));
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