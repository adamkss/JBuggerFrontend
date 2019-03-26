import { SET_BUGS, ADD_BUG, FILTER_BUGS, MOVE_BUG_VISUALLY, WAITING_FOR_BUG_UPDATE, SET_STATUSES, BUG_CLICKED, CLOSE_MODAL, SET_USER_NAMES, SET_BUG, UPDATE_CURRENTLY_ACTIVE_BUG, SET_LABELS, CREATE_SWIMLANE, REORDER_STATUSES, DELETE_SWIMLANE_WITH_BUGS, UPDATE_SWIMLANE_NAME, UPDATE_SWIMLANE_COLOR, CREATE_LABEL, DELETE_ATTACHMENT, ADD_ATTACHMENT_INFO } from '../actions/actionTypes'
import BugShortOverview from '../../BugShortOverview';

// TODO: do we really need filteredbugs to be a separate entity?
const initialState = {
    statuses: [],
    allBugs: [],
    bugsByStatus: {},
    filteredBugs: [],
    waitingForBugUpdate: false,
    filterString: null,
    activeBugToModifyID: null,
    activeBugToModify: null,
    bugsById: {},
    usernames: [],
    severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    labels: []
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
        case SET_BUGS:
            return {
                ...state,
                allBugs: action.data,
                bugsByStatus: mapBugsToObjectByStatus(state.statuses, action.data),
                filteredBugs: action.data,
                bugsById: mapBugsToIdMap(action.data)
            }
        case ADD_BUG: {
            let newAllBugs = [...state.allBugs, action.newBug];
            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: addBugToBugsByStatus(state.bugsByStatus, action.newBug),
                bugsById: getBugsMapWithNewBug(state.bugsById, action.newBug)
            }
        }
        case FILTER_BUGS: {
            let filteredBugs = filterBugs(state.allBugs, action.filterString);

            return {
                ...state,
                bugsByStatus: mapBugsToObjectByStatus(state.statuses, filteredBugs),
                filteredBugs,
                filterString: action.filterString
            }
        }
        case WAITING_FOR_BUG_UPDATE: {
            return {
                ...state,
                waitingForBugUpdate: true
            }
        }

        case MOVE_BUG_VISUALLY: {
            if (action.data.oldStatus === action.data.newStatus)
                return {
                    ...state,
                    waitingForBugUpdate: false
                }
            let allBugsWithoutModified = [...state.allBugs.filter(bug => bug.id != action.data.bugId)];
            let modifiedBug = {
                ...state.bugsById[action.data.bugId],
                status: action.data.newStatus
            };
            let allBugs = [...allBugsWithoutModified, modifiedBug];

            return {
                ...state,
                allBugs: allBugs,
                bugsByStatus: mapBugsToObjectByStatus(state.statuses, filterBugs(allBugs, state.filterString)),
                bugsById: getBugsMapWithNewBug(state.bugsById, modifiedBug),
                waitingForBugUpdate: false
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

            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: mapBugsToObjectByStatus(state.statuses, newAllBugs),
                filteredBugs: mapBugsToObjectByStatus(state.statuses, filterBugs(newAllBugs, state.filterString)),
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
            return {
                ...state,
                statuses: [...state.statuses, action.data],
                bugsByStatus: {
                    ...state.bugsByStatus,
                    [action.data.statusName]: []
                }
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
            return {
                ...state,
                allBugs: deleteBugsWithStatus(state.allBugs, statusName),
                bugsByStatus: deleteKeyFromObject(state.bugsByStatus, statusName),
                bugsById: deleteBugsWithStatusFromMap(state.bugsById, statusName),
                statuses: state.statuses.filter(status => status.statusName !== statusName)
            }
        }
        case UPDATE_SWIMLANE_NAME: {
            let { oldSwimLaneName, newSwimLaneName } = action.data;
            return {
                ...state,
                allBugs: updateStatusNameOfBugs(state.allBugs, oldSwimLaneName, newSwimLaneName),
                bugsByStatus: updateBugsByStatusNameOfStatus(state.bugsByStatus, oldSwimLaneName, newSwimLaneName),
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
                labels: [...state.labels, action.data]
            }
        }
        case DELETE_ATTACHMENT: {
            const newAllBugs = deleteAttachmentFromAllBugs(state.allBugs, action.data.bugId, action.data.attachmentId);
            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: mapBugsToObjectByStatus(state.statuses, newAllBugs),
                bugsById: mapBugsToIdMap(newAllBugs),
                activeBugToModify: {
                    ...state.activeBugToModify,
                    attachmentsInfo: state.activeBugToModify.attachmentsInfo.filter(attachmentInfo => attachmentInfo.id != action.data.attachmentId)
                }

            }
        }
        case ADD_ATTACHMENT_INFO: {
            const newAllBugs = addAttachmentInfoToBug(state.allBugs, action.data.bugId, action.data.attachmentInfo);
            return {
                ...state,
                allBugs: newAllBugs,
                bugsByStatus: mapBugsToObjectByStatus(state.statuses, newAllBugs),
                bugsById: mapBugsToIdMap(newAllBugs),
                activeBugToModify: {
                    ...state.activeBugToModify,
                    attachmentsInfo: [...state.activeBugToModify.attachmentsInfo, action.data.attachmentInfo]
                }
            }
        }
        default:
            return state;
    }
}

export default bugReducer;