import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Typography, Input, Select, MenuItem, TextField, IconButton, CircularProgress } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import './BugDetailsModal.css';
import { closeModal, getUserNames, getLabels, startUpdatingBugLabels, startDownloadingFile, startDeletingAttachment, addAttachmentInfo } from './redux-stuff/actions/actionCreators';
import BugDetailsSidebarSection from './BugDetailsSidebarSection';
import LabelShort from './LabelShort';
import AttachmentShortOverview from './AttachmentShortOverview';
import Comments from './Comments';
import { downloadFile } from './utils/DownloadHelper';
import { uploadFile } from './utils/UploadHelper';
import CreateCommentDialog from './popovers/CreateCommentDialog';

class BugDetailsModal extends PureComponent {
    state = {
        assignedToUsernameNew: null,
        severityNew: null,
        revisionNew: null,
        open: false,
        mustClose: false,
        targetDateNew: null,
        descriptionNew: null,
        labelsSelectionState: {},
        isUploadInProgress: false,
        isAssignedToInEditMode: false,
        isSeverityInEditMode: false,
        isRevisionInEditMode: false,
        isTargetDateInEditMode: false,
        isDescriptionInEditMode: false,
        isLabelsInEditMode: false,
        isAttachmentsInEditMode: false,
        comments: [],
        isCreateCommentDialogOpen: false
    }

    constructor(props) {
        super(props);
        this.inputOpenFileRef = React.createRef();
    }

    resetAllSubsectionsToViewMode = () => {
        this.setState({
            isAssignedToInEditMode: false,
            isSeverityInEditMode: false,
            isRevisionInEditMode: false,
            isTargetDateInEditMode: false,
            isDescriptionInEditMode: false,
            isLabelsInEditMode: false,
            isAttachmentsInEditMode: false
        })
    }

    onEditClickBugSubsection = stateToModify => event => {
        this.setState({
            [stateToModify]: true
        })
    }

    onEndEditModeForSubsection = stateToModify => event => {
        this.setState({
            [stateToModify]: false
        })
    }

    onModalClose = () => {
        this.props.dispatch(closeModal());
    }

    componentDidUpdate(prevProps) {
        if (prevProps.bug.id !== this.props.bug.id) {
            this.resetAllSubsectionsToViewMode();
            this.getCommentsForCurrentBug();
        }
        if ((prevProps.bug.id !== this.props.bug.id)
            || (prevProps.labels !== this.props.labels)) {
            this.calculateLabelsSelectionState();
        }

    }

    getCommentsForCurrentBug = () => {
        fetch(`http://localhost:8080/comments/bug/${this.props.bug.id}`)
            .then(resp => resp.json())
            .then(comments => {
                this.setState({
                    comments
                })
            })
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                open: true
            })
        })

        this.getCommentsForCurrentBug();
        this.calculateLabelsSelectionState();
    }

    onAssignedToEditClick = () => {

    }

    handleChange = (field) => {
        return (event) => {
            this.setState({
                [field]: event.target.value
            })
        }

    }

    onEditClickAssignedTo = () => {
        this.setState({
            isAssignedToInEditMode: true
        })

        this.props.dispatch(getUserNames());
    }

    onAssignedToSave = () => {
        if (this.state.assignedToNew != null && this.state.assignedToNew !== this.props.bug.assignedToUsername) {
            this.props.onBugEdit({
                ...this.props.bug,
                assignedToUsername: this.state.assignedToNew
            })
        }
    }

    onEditClickSeverity = () => {
        this.setState({
            isSeverityInEditMode: true
        })
    }

    onSeveritySave = () => {
        if (this.state.severityNew != null && this.state.severityNew !== this.props.bug.severity) {
            this.props.onBugEdit({
                ...this.props.bug,
                severity: this.state.severityNew
            })
        }
    }

    onRevisionSave = () => {
        if (this.state.revisionNew != null && this.state.revisionNew !== this.props.bug.revision) {
            this.props.onBugEdit({
                ...this.props.bug,
                revision: this.state.revisionNew
            })
        }
    }

    onSaveGeneral = (propertyName) => {
        return () => {
            if (this.state[propertyName + "New"] != null && this.state[propertyName + "New"] !== this.props.bug[propertyName]) {
                this.props.onBugEdit({
                    ...this.props.bug,
                    [propertyName]: this.state[propertyName + "New"]
                })
            }
        }
    }

    onLabelsEditClick = () => {
        this.props.dispatch(getLabels());
    }

    isLabelAlreadyOnBug(labelTitle) {
        let nr = this.props.bug.labels.filter(label => label.labelName === labelTitle).length;
        return nr === 1;
    }

    onLabelClick(labelName) {
        return () => {
            this.setState((currentState) => {
                return {
                    labelsSelectionState: {
                        ...currentState.labelsSelectionState,
                        [labelName]: !currentState.labelsSelectionState[labelName]
                    }
                }
            })
        }
    }

    calculateLabelsSelectionState = () => {
        let labelsSelectionState = {};

        this.props.labels.forEach(label => {
            labelsSelectionState[label.labelName] = this.isLabelAlreadyOnBug(label.labelName);
        })
        this.setState(
            {
                labelsSelectionState
            }
        )
    }

    onSaveLabels = () => {
        let newLabels = [];

        Object.keys(this.state.labelsSelectionState).forEach(labelName => {
            if (this.state.labelsSelectionState[labelName])
                newLabels.push(labelName);
        })
        this.props.dispatch(startUpdatingBugLabels(this.props.bug.id, newLabels));
    }

    startDownloadingAttachment = (attachmentInfo) => {
        return () => {
            downloadFile(attachmentInfo.name, `http://localhost:8080/attachments/attachment/${attachmentInfo.id}/blob`)
        }
    }

    onRemoveAttachment = (bugId, attachmentId) => {
        return () => {
            this.props.dispatch(startDeletingAttachment(bugId, attachmentId));
        }
    }

    onAddAttachmentToCurrentBug = () => {
        this.inputOpenFileRef.current.click();
    }

    onAttachmentInputSelected = (event) => {
        uploadFile(event.target.files[0], `http://localhost:8080/attachments/attachment/upload/${this.props.bug.id}`,
            (newAttachmentInfo) => {
                this.props.dispatch(addAttachmentInfo(this.props.bug.id, newAttachmentInfo));
                this.setState({
                    isUploadInProgress: false
                })
            });
        this.setState({
            isUploadInProgress: true
        })
    }

    onNewCommentPress = () => {
        this.setState({
            isCreateCommentDialogOpen: true
        })
    }

    onCreateComment = (newCommentMessage) => {
        fetch(`http://localhost:8080/comments/bug/${this.props.bug.id}`, {
            method: "POST",
            body: JSON.stringify({
                commentText: newCommentMessage
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                this.getCommentsForCurrentBug();
                this.setState({
                    isCreateCommentDialogOpen: false
                })
            })
    }

    render() {
        let extraClassIfOpen = this.state.open && !this.props.mustClose ? " modal-expanded" : "";
        return (
            <>

                <aside className={"modal-parent" + extraClassIfOpen}>
                    {this.props.bug ?
                        <div className="sidebar">
                            <header className="modal__header">
                                <div className="header__bug-info">
                                    <Typography variant="subtitle2" color="inherit">
                                        {this.props.bug.title}
                                    </Typography>
                                    <Typography variant="caption" color="inherit">
                                        #{this.props.bug.id}
                                    </Typography>
                                </div>
                                <div className="header__vertical-separator" />
                                <a aria-label="Toggle sidebar" href="#" role="button" onClick={this.onModalClose} className="header__close-button" tabIndex="-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                                        <path d="M9,7.5l5.83-5.91a.48.48,0,0,0,0-.69L14.11.15a.46.46,0,0,0-.68,0l-5.93,6L1.57.15a.46.46,0,0,0-.68,0L.15.9a.48.48,0,0,0,0,.69L6,7.5.15,13.41a.48.48,0,0,0,0,.69l.74.75a.46.46,0,0,0,.68,0l5.93-6,5.93,6a.46.46,0,0,0,.68,0l.74-.75a.48.48,0,0,0,0-.69Z">
                                        </path>
                                    </svg>
                                </a>
                            </header >
                            <div className="sidebar__horizontal-separator" />
                            <main>
                                <BugDetailsSidebarSection
                                    sectionName="Assigned to"
                                    initialData={this.props.bug.assignedToName}
                                    isInEditMode={this.state.isAssignedToInEditMode}
                                    onEditClick={this.onEditClickAssignedTo}
                                    onEndEditMode={this.onEndEditModeForSubsection('isAssignedToInEditMode')}
                                    onSave={this.onSaveGeneral('assignedToUsername')}
                                    renderEditControl={() => {
                                        return (
                                            <Select
                                                value={this.state.assignedToUsernameNew || this.props.bug.assignedToUsername}
                                                onChange={this.handleChange('assignedToUsernameNew')}
                                            >
                                                {this.props.usernames.map(user =>
                                                    <MenuItem key={user.username} value={user.username}>{user.username + "-" + user.name}</MenuItem>
                                                )}
                                            </Select>
                                        )
                                    }} />
                                <div className="sidebar__horizontal-separator" />
                                <BugDetailsSidebarSection
                                    sectionName="Severity"
                                    initialData={this.props.bug.severity}
                                    isInEditMode={this.state.isSeverityInEditMode}
                                    onEditClick={this.onEditClickSeverity}
                                    onEndEditMode={this.onEndEditModeForSubsection('isSeverityInEditMode')}
                                    onSave={this.onSaveGeneral('severity')}
                                    renderEditControl={() => {
                                        return (
                                            <Select
                                                value={this.state.severityNew || this.props.bug.severity}
                                                onChange={this.handleChange('severityNew')}
                                            >
                                                {this.props.severities.map(severity =>
                                                    <MenuItem key={severity} value={severity}>{severity}</MenuItem>
                                                )}
                                            </Select>
                                        )
                                    }} />
                                <div className="sidebar__horizontal-separator" />
                                <BugDetailsSidebarSection
                                    sectionName="Revision"
                                    initialData={this.props.bug.revision}
                                    isInEditMode={this.state.isRevisionInEditMode}
                                    onEditClick={this.onEditClickBugSubsection('isRevisionInEditMode')}
                                    onEndEditMode={this.onEndEditModeForSubsection('isRevisionInEditMode')}
                                    onSave={this.onSaveGeneral('revision')}
                                    renderEditControl={() => {
                                        return (
                                            <Input
                                                value={this.state.revisionNew || this.props.bug.revision}
                                                onChange={this.handleChange('revisionNew')} />
                                        )
                                    }} />
                                <div className="sidebar__horizontal-separator" />
                                <BugDetailsSidebarSection
                                    sectionName="Target date"
                                    initialData={this.props.bug.targetDate}
                                    isInEditMode={this.state.isTargetDateInEditMode}
                                    onEditClick={this.onEditClickBugSubsection('isTargetDateInEditMode')}
                                    onEndEditMode={this.onEndEditModeForSubsection('isTargetDateInEditMode')}
                                    onSave={this.onSaveGeneral('targetDate')}
                                    renderEditControl={() => {
                                        return (
                                            <TextField
                                                type="date"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={this.state.targetDateNew || this.props.bug.targetDate}
                                                onChange={this.handleChange('targetDateNew')}
                                            />
                                        )
                                    }} />
                                <div className="sidebar__horizontal-separator" />
                                <BugDetailsSidebarSection
                                    sectionName="Description"
                                    initialData={this.props.bug.description}
                                    isInEditMode={this.state.isDescriptionInEditMode}
                                    onEditClick={this.onEditClickBugSubsection('isDescriptionInEditMode')}
                                    onEndEditMode={this.onEndEditModeForSubsection('isDescriptionInEditMode')}
                                    onSave={this.onSaveGeneral('description')}
                                    renderEditControl={() => {
                                        return (
                                            <Input
                                                className="full-width"
                                                multiline
                                                value={this.state.descriptionNew || this.props.bug.description}
                                                onChange={this.handleChange('descriptionNew')} />
                                        )
                                    }} />
                                <div className="sidebar__horizontal-separator" />
                                <BugDetailsSidebarSection
                                    sectionName="Labels"
                                    onEditClick={this.onLabelsEditClick}
                                    isInEditMode={this.state.isLabelsInEditMode}
                                    onEditClick={this.onEditClickBugSubsection('isLabelsInEditMode')}
                                    onEndEditMode={this.onEndEditModeForSubsection('isLabelsInEditMode')}
                                    onSave={this.onSaveLabels}
                                    renderViewControl={() => {
                                        if (this.props.bug.labels.length > 0) {
                                            return (
                                                <div className="flexbox-horizontal flex-wrap small-margin-top">
                                                    {this.props.bug.labels.map(label =>
                                                        <LabelShort
                                                            key={label.labelName}
                                                            text={label.labelName}
                                                            backgroundColor={label.backgroundColor}
                                                            smallMarginBottom />)}
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="flexbox-horizontal flexbox-justify-center">
                                                    <Typography variant="subtitle2" className="sidebar__detail-info">No labels yet.</Typography>
                                                </div>
                                            )
                                        }
                                    }}
                                    renderEditControl={() => {
                                        return (
                                            <div className="flexbox-horizontal flex-wrap small-margin-top">
                                                {this.props.labels.map(label => {
                                                    return <LabelShort
                                                        selectable
                                                        selected={this.state.labelsSelectionState[label.labelName]}
                                                        onClick={this.onLabelClick(label.labelName)}
                                                        key={label.labelName}
                                                        text={label.labelName}
                                                        backgroundColor={label.backgroundColor}
                                                        smallMarginBottom />
                                                }
                                                )}
                                            </div>
                                        )
                                    }} />
                                <div className="sidebar__horizontal-separator" />
                                <BugDetailsSidebarSection
                                    sectionName="Attachments"
                                    initialData={this.props.bug.description}
                                    isInEditMode={this.state.isAttachmentsInEditMode}
                                    onEditClick={this.onEditClickBugSubsection('isAttachmentsInEditMode')}
                                    onEndEditMode={this.onEndEditModeForSubsection('isAttachmentsInEditMode')}
                                    doneInsteadOfSaveAndCancel
                                    renderViewControl={() => {
                                        if (this.props.bug.attachmentsInfo.length > 0) {
                                            return (
                                                this.props.bug.attachmentsInfo.map(attachmentInfo =>
                                                    <AttachmentShortOverview
                                                        key={attachmentInfo.id}
                                                        attachmentName={attachmentInfo.name}
                                                        attachmentId={attachmentInfo.id}
                                                        onAttachmentClick={this.startDownloadingAttachment(attachmentInfo)} />
                                                )
                                            )
                                        } else {
                                            return (
                                                <div className="flexbox-horizontal flexbox-justify-center">
                                                    <Typography variant="subtitle2" className="sidebar__detail-info">No attachments yet.</Typography>
                                                </div>
                                            )
                                        }
                                    }}
                                    renderEditControl={() => {
                                        return (
                                            <>
                                                {this.props.bug.attachmentsInfo.map(attachmentInfo =>
                                                    <AttachmentShortOverview
                                                        key={attachmentInfo.id}
                                                        attachmentName={attachmentInfo.name}
                                                        attachmentId={attachmentInfo.id}
                                                        onAttachmentClick={this.startDownloadingAttachment(attachmentInfo)}
                                                        showRemoveIcon
                                                        onClickRemoveAttachment={this.onRemoveAttachment(this.props.bug.id, attachmentInfo.id)} />
                                                )}
                                                <div className="flexbox-horizontal justify-flex-end">
                                                    <IconButton
                                                        className="small-padding-all-over"
                                                        onClick={this.onAddAttachmentToCurrentBug}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </div>
                                                <input
                                                    type="file"
                                                    onChange={this.onAttachmentInputSelected}
                                                    ref={this.inputOpenFileRef}
                                                    style={{ display: "none" }}
                                                />
                                                {this.state.isUploadInProgress ?
                                                    <div className="full-width flexbox-horizontal flexbox-justify-center">
                                                        <CircularProgress
                                                            variant="indeterminate"
                                                            disableShrink
                                                            className="progress-circular"
                                                            size={24}
                                                            thickness={4}
                                                        />
                                                    </div>
                                                    :
                                                    null}
                                            </>
                                        )
                                    }} />

                                <div className="sidebar__horizontal-separator" />
                                <Comments
                                    comments={this.state.comments}
                                    onNewCommentPress={this.onNewCommentPress} />
                            </main>
                        </div>
                        : ""}
                </aside >
                {this.state.isCreateCommentDialogOpen ?
                    <CreateCommentDialog
                        onCancel={() => {
                            this.setState({
                                isCreateCommentDialogOpen: false
                            })
                        }}
                        onDone={this.onCreateComment} />
                    :
                    null
                }
            </>
        )
    }
}

const mapStateToProps = state => ({
    bug: state.activeBugToModify,
    usernames: state.usernames,
    severities: state.severities,
    labels: state.labels
});

export default connect(mapStateToProps)(BugDetailsModal);