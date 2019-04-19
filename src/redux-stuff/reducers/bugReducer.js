import { SET_BUGS, ADD_BUG, FILTER_BUGS, MOVE_BUG_VISUALLY, SET_STATUSES, BUG_CLICKED, CLOSE_MODAL, SET_USER_NAMES, SET_BUG, UPDATE_CURRENTLY_ACTIVE_BUG, SET_LABELS, CREATE_SWIMLANE, REORDER_STATUSES, DELETE_SWIMLANE_WITH_BUGS, UPDATE_SWIMLANE_NAME, UPDATE_SWIMLANE_COLOR, CREATE_LABEL, DELETE_ATTACHMENT, ADD_ATTACHMENT_INFO, START_GETTING_BUGS, WAITING_FOR_BUG_STATUS_UPDATE, NEW_LABEL_ALREADY_EXISTS, LABEL_CREATION_ABANDONED, DELETE_CURRENTLY_ACTIVE_BUG, CLOSE_CURRENT_BUG, SUCCESFULLY_SUBSCRIBED_TO_BUG, SUCCESFULLY_UNSUBSCRIBED_TO_BUG, SET_PROJECTS, SET_CURRENT_PROJECT } from '../actions/actionTypes'

const initialState = {
    projects: [],
    currentProjectId: null,
    statuses: [],
    allBugs: [],
    bugsByStatus: {},
    bugsByStatusFiltered: {},
    waitingForBugLoading: false,
    waitingForBugStatusUpdate: false,
    filterString: "",
    activeBugToModifyID: null,
    activeBugToModify: null,
    bugsById: {},
    usernames: [],
    severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    labels: [],
    movingBugOldStatus: null,
    movingBugNewStatus: null,
    doesNewLabelAlreadyExist: false
}

const addBugByStatus = function (oldBugsByStatus, newBug) {
    let newBugByStatus = { ...oldBugsByStatus };
    newBugByStatus[newBug.status] = [...newBugByStatus[newBug.status], newBug];
    return newBugByStatus;
}

const mapBugsToObjectByStatus = function (statuses, bugs) {
    const bugsByStatus = {};

    statuses.forEach(status => {
        bugsByStatus[status.statusName] = [];
    });

    bugs.forEach(bug => {
        bugsByStatus[bug.status].push(bug);
    });

    return bugsByStatus;
}

const addBugToBugsByStatus = function (oldBugsByStatus, newBug) {
    const bugsByStatus = { ...oldBugsByStatus };

    bugsByStatus[newBug.status] = [...bugsByStatus[newBug.status], newBug];

    return bugsByStatus;
}

const filterBugs = function (bugs, filterString) {
    if (!filterString || filterString === "")
        return bugs;

    let filterStringUpperCase = filterString.toUpperCase();
    return bugs.filter(bug => bug.title.toUpperCase().includes(filterStringUpperCase));
}

const filterBugsByStatusByFilterString = (bugsByStatus, filterString) => {
    if (filterString && filterString != "") {
        let filteredBugsByStatus = {};
        let filterStringUpperCase = filterString.toUpperCase();

        Object.keys(bugsByStatus).forEach(key => {
            filteredBugsByStatus[key] = bugsByStatus[key].filter(bug => bug.title.toUpperCase().includes(filterStringUpperCase));
        });

        return filteredBugsByStatus;
    }
    return bugsByStatus;
}

const initializeBugMapFromArray = (statuses) => {
    let map = {};
    statuses.forEach(status => {
        map[status.statusName] = [];
    })
    return map;
}

const mapBugsToIdMap = (bugs) => {
    let bugsMap = {};
    bugs.forEach((bug) => {
        bugsMap[bug.id] = bug;
    });
    return bugsMap;
}

const getBugsMapWithNewBug = (oldBugsMap, bug) => {
    let bugsMap = { ...oldBugsMap };
    bugsMap[bug.id] = bug;
    return bugsMap;
}

const editBugById = (bugsArray, newBug) => {
    let newBugs = [...bugsArray];
    let bugToModify = newBugs.filter(bug => bug.id === newBug.id)[0];
    newBugs[newBugs.indexOf(bugToModify)] = {
        ...bugToModify,
        ...newBug
    };
    return newBugs;
}

const moveElementFromTo = (array, fromIndex, toIndex) => {
    const result = Array.from(array);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);

    return result;
}

const deleteBugsWithStatus = (bugs, statusName) => {
    return bugs.filter(bug => bug.status !== statusName);
}

const deleteKeyFromObject = (obj, key) => {
    let objNew = { ...obj };
    delete objNew.key;
    return objNew;
}

const deleteBugsWithStatusFromMap = (bugsMap, statusName) => {
    let bugsMapNew = { ...bugsMap };

    Object.keys(bugsMap).forEach(key => {
        if (bugsMap[key].status === statusName) {
            delete bugsMapNew[key];
        }
    })
    return bugsMapNew;
}

const updateStatusNameOfBugs = (bugs, oldStatusName, newStatusName) => {
    let newBugsArray = [...bugs];
    bugs.forEach(bug => {
        if (bug.status === oldStatusName) {
            bug.status = newStatusName;
        }
    });
    return newBugsArray;
}

const updateBugsByStatusNameOfStatus = (bugsByStatusOld, oldStatusName, newStatusName) => {
    let newBugsByStatus = { ...bugsByStatusOld };
    newBugsByStatus[newStatusName] = [...newBugsByStatus[oldStatusName]];
    delete newBugsByStatus[oldStatusName];
    return newBugsByStatus;
}

const updateStatusesWithNewStatusName = (oldStatuses, oldStatusName, newStatusName) => {
    let statusToReplace = oldStatuses.find(status => status.statusName === oldStatusName);
    let indexOfStatusToReplace = oldStatuses.indexOf(statusToReplace);

    return oldStatuses.map((status, index) => {
        if (index !== indexOfStatusToReplace) {
            // This isn't the item we care about - keep it as-is
            return status
        }

        // Otherwise, this is the one we want - return an updated value
        return {
            ...status,
            statusName: newStatusName
        }
    })
}

const updateStatusNameOfBugsById = (oldBugsById, oldStatusName, newStatusName) => {
    let newBugsById = { ...oldBugsById };
    Object.keys(newBugsById).forEach(key => {
        if (newBugsById[key].status === oldStatusName) {
            newBugsById[key].status = newStatusName;
        }
    });
    return newBugsById;
}

const updateStatusesWithNewStatusColor = (oldStatuses, statusName, newStatusColor) => {
    let statusToReplace = oldStatuses.find(status => status.statusName === statusName);
    let indexOfStatusToReplace = oldStatuses.indexOf(statusToReplace);

    return oldStatuses.map((status, index) => {
        if (index !== indexOfStatusToReplace) {
            // This isn't the item we care about - keep it as-is
            return status
        }

        // Otherwise, this is the one we want - return an updated value
        return {
            ...status,
            statusColor: newStatusColor
        }
    })
}

const deleteAttachmentFromAllBugs = (oldAllBugs, bugId, attachmentId) => {
    return oldAllBugs.map(bug => {
        if (bug.id != bugId)
            return bug;

        return {
            ...bug,
            attachmentsInfo: bug.attachmentsInfo.filter(
                attachmentInfo => attachmentInfo.id != attachmentId
            )
        }
    })
}

const addAttachmentInfoToBug = (oldAllBugs, bugId, attachmentInfo) => {
    return oldAllBugs.map(bug => {
        if (bug.id != bugId)
            return bug;

        return {
            ...bug,
            attachmentsInfo: [...bug.attachmentsInfo, attachmentInfo]
        }
    })
}

const bugReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STATUSES: {
            return {
                ...state,
                statuses: action.data,
                bugsByStatus: initializeBugMapFromArray(action.data)
            }
        }
        case START_GETTING_BUGS: {
            return {
                ...state,
                waitingForBugLoading: true
            }
        }
        case SET_BUGS:
            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, action.data);
            return {
                ...state,
                allBugs: action.data,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: mapBugsToIdMap(action.data),
                waitingForBugLoading: false
            }
        case ADD_BUG: {
            let newAllBugs = [...state.allBugs, action.newBug];
            const bugsByStatus = addBugToBugsByStatus(state.bugsByStatus, action.newBug);
            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: getBugsMapWithNewBug(state.bugsById, action.newBug)
            }
        }
        case FILTER_BUGS: {
            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, state.allBugs);
            return {
                ...state,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, action.filterString),
                filterString: action.filterString
            }
        }
        case WAITING_FOR_BUG_STATUS_UPDATE: {
            const { oldStatus, newStatus } = action.data;

            return {
                ...state,
                waitingForBugStatusUpdate: true,
                movingBugOldStatus: oldStatus,
                movingBugNewStatus: newStatus
            }
        }
        case MOVE_BUG_VISUALLY: {
            if (action.data.oldStatus === action.data.newStatus)
                return {
                    ...state,
                    waitingForBugStatusUpdate: false
                }
            let allBugsWithoutModified = [...state.allBugs.filter(bug => bug.id != action.data.bugId)];
            let modifiedBug = {
                ...state.bugsById[action.data.bugId],
                status: action.data.newStatus
            };
            let allBugs = [...allBugsWithoutModified, modifiedBug];

            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, allBugs);
            return {
                ...state,
                allBugs: allBugs,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: getBugsMapWithNewBug(state.bugsById, modifiedBug),
                waitingForBugStatusUpdate: false,
                movingBugOldStatus: null,
                movingBugNewStatus: null
            }
        }
        case BUG_CLICKED: {
            return {
                ...state,
                activeBugToModifyID: action.data,
                activeBugToModify: state.bugsById[action.data]
            }
        }
        case CLOSE_MODAL: {
            return {
                ...state,
                activeBugToModifyID: null
            }
        }
        case SET_USER_NAMES: {
            return {
                ...state,
                usernames: action.data
            }
        }
        case SET_BUG: {
            let newAllBugs = editBugById(state.allBugs, action.data);
            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, newAllBugs);
            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: mapBugsToIdMap(newAllBugs)
            }
        }
        case UPDATE_CURRENTLY_ACTIVE_BUG: {
            return {
                ...state,
                activeBugToModify: action.data
            }
        }
        case SET_LABELS: {
            return {
                ...state,
                labels: action.data
            }
        }
        case CREATE_SWIMLANE: {
            const bugsByStatus = {
                ...state.bugsByStatus,
                [action.data.statusName]: []
            };

            return {
                ...state,
                statuses: [action.data, ...state.statuses],
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString)
            }
        }
        case REORDER_STATUSES: {
            return {
                ...state,
                statuses: moveElementFromTo(state.statuses, action.data.fromIndex, action.data.toIndex)
            }
        }
        case DELETE_SWIMLANE_WITH_BUGS: {
            let statusName = action.data;
            const bugsByStatus = deleteKeyFromObject(state.bugsByStatus, statusName);
            return {
                ...state,
                allBugs: deleteBugsWithStatus(state.allBugs, statusName),
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: deleteBugsWithStatusFromMap(state.bugsById, statusName),
                statuses: state.statuses.filter(status => status.statusName !== statusName)
            }
        }
        case UPDATE_SWIMLANE_NAME: {
            let { oldSwimLaneName, newSwimLaneName } = action.data;
            const bugsByStatus = updateBugsByStatusNameOfStatus(state.bugsByStatus, oldSwimLaneName, newSwimLaneName);
            return {
                ...state,
                allBugs: updateStatusNameOfBugs(state.allBugs, oldSwimLaneName, newSwimLaneName),
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: updateStatusNameOfBugsById(state.bugsById, oldSwimLaneName, newSwimLaneName),
                statuses: updateStatusesWithNewStatusName(state.statuses, oldSwimLaneName, newSwimLaneName)
            }
        }
        case UPDATE_SWIMLANE_COLOR: {
            let { swimlaneName, newSwimlaneColor } = action.data;
            return {
                ...state,
                statuses: updateStatusesWithNewStatusColor(state.statuses, swimlaneName, newSwimlaneColor)
            }
        }
        case CREATE_LABEL: {
            return {
                ...state,
                labels: [...state.labels, action.data],
                doesNewLabelAlreadyExist: false
            }
        }
        case DELETE_ATTACHMENT: {
            const newAllBugs = deleteAttachmentFromAllBugs(state.allBugs, action.data.bugId, action.data.attachmentId);
            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, newAllBugs);
            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: mapBugsToIdMap(newAllBugs),
                activeBugToModify: {
                    ...state.activeBugToModify,
                    attachmentsInfo: state.activeBugToModify.attachmentsInfo.filter(attachmentInfo => attachmentInfo.id != action.data.attachmentId)
                }

            }
        }
        case ADD_ATTACHMENT_INFO: {
            const newAllBugs = addAttachmentInfoToBug(state.allBugs, action.data.bugId, action.data.attachmentInfo);
            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, newAllBugs);
            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: mapBugsToIdMap(newAllBugs),
                activeBugToModify: {
                    ...state.activeBugToModify,
                    attachmentsInfo: [...state.activeBugToModify.attachmentsInfo, action.data.attachmentInfo]
                }
            }
        }
        case NEW_LABEL_ALREADY_EXISTS: {
            return {
                ...state,
                doesNewLabelAlreadyExist: true
            }
        }
        case LABEL_CREATION_ABANDONED: {
            return {
                ...state,
                doesNewLabelAlreadyExist: false
            }
        }
        case DELETE_CURRENTLY_ACTIVE_BUG: {
            const newAllBugs = state.allBugs.filter(bug => bug.id !== state.activeBugToModify.id);
            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, newAllBugs);
            return {
                ...state,
                activeBugToModify: null,
                activeBugToModifyID: null,
                allBugs: newAllBugs,
                bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: mapBugsToIdMap(newAllBugs)
            }
        }
        case CLOSE_CURRENT_BUG: {
            let allBugsWithoutModified = [...state.allBugs.filter(bug => bug.id != state.activeBugToModify.id)];
            let modifiedBug = {
                ...state.activeBugToModify,
                status: "CLOSED"
            };
            let allBugs = [...allBugsWithoutModified, modifiedBug];

            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, allBugs);
            return {
                ...state,
                allBugs: allBugs,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: getBugsMapWithNewBug(state.bugsById, modifiedBug),
                activeBugToModifyID: null,
                activeBugToModify: null,
            }
        }
        case SUCCESFULLY_SUBSCRIBED_TO_BUG: {
            const bugId = action.bugId;
            const modifiedBug = {
                ...state.allBugs.filter(bug => bug.id == bugId)[0],
                currentUserInterestedInMe: true
            };
            const newAllBugs = editBugById(state.allBugs, modifiedBug);
            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, newAllBugs);
            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: getBugsMapWithNewBug(state.bugsById, modifiedBug),
            }
        }
        case SUCCESFULLY_UNSUBSCRIBED_TO_BUG: {
            const bugId = action.bugId;
            const modifiedBug = {
                ...state.allBugs.filter(bug => bug.id == bugId)[0],
                currentUserInterestedInMe: false
            };
            const newAllBugs = editBugById(state.allBugs, modifiedBug);
            const bugsByStatus = mapBugsToObjectByStatus(state.statuses, newAllBugs);
            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: bugsByStatus,
                bugsByStatusFiltered: filterBugsByStatusByFilterString(bugsByStatus, state.filterString),
                bugsById: getBugsMapWithNewBug(state.bugsById, modifiedBug),
            }
        }
        case SET_PROJECTS: {
            return {
                ...state,
                projects: action.projects
            }
        }
        case SET_CURRENT_PROJECT : {
            return {
                ...state,
                currentProjectId: action.projectId
            }
        }
        default:
            return state;
    }
}

export default bugReducer;