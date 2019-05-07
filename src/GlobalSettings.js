import React, { Component } from 'react'
import './ProjectSettings.css';

import { connect } from 'react-redux';
import { Paper, Input, Button, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Select, MenuItem, List, ListItemSecondaryAction, IconButton, Icon } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PeopleIcon from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/Add';
import ProjectSettingsSection from './ProjectSettingsSection';
import LabelShort from './LabelShort';
import NewLabelDialog from './popovers/NewLabelDialog';
import { createNewLabel, startCreatingNewLabel, labelCreationAbandoned } from './redux-stuff/actions/actionCreators';
import axios from 'axios';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import CreateProjectPopover from './CreateProjectPopover';
import './GlobalSettings.css';

class GlobalSettings extends Component {
    state = {
        projects: [],
        isCreateProjectPopoverOpen: false,
        currentlyEditedProject: null,
        currentlyEditedProjectAssignedUsers: [],
        currentlyEditedProjectUnassignedUsers: [],
    }

    componentDidMount = () => {
        axios.get(`http://localhost:8080/projects`)
            .then(({ data: projects }) => {
                this.setState({
                    projects
                })
            })
    }

    handleCreateProject = (newProjectName) => {
        axios.post(`http://localhost:8080/projects`, {
            projectName: newProjectName
        }).then(({ data: newProject }) => {
            this.setState((oldState) => ({
                projects: [...oldState.projects, newProject],
                isCreateProjectPopoverOpen: false
            }))
        })
    }

    loadCurrentlyEditedProjectData = async () => {
        const assignedUsers = (await axios.get(`http://localhost:8080/projects/${this.state.currentlyEditedProject}/members`)).data;
        const unassignedUsers = (await axios.get(`http://localhost:8080/projects/${this.state.currentlyEditedProject}/notMembers`)).data;
        this.setState({
            currentlyEditedProjectAssignedUsers: assignedUsers,
            currentlyEditedProjectUnassignedUsers: unassignedUsers
        })
    }

    getCallbackOnEditProject = (projectId) => () => {
        this.setState({
            currentlyEditedProject: projectId,
        }, () => {
            this.loadCurrentlyEditedProjectData();
        })
    }

    getCallbackForAddUserToProject = userId => () => {
        axios.put(`http://localhost:8080/projects/${this.state.currentlyEditedProject}/members/${userId}`)
            .then(() => {
                this.loadCurrentlyEditedProjectData();
            })
    }

    getCallbackForRemoveUserFromProject = userId => () => {
        axios.delete(`http://localhost:8080/projects/${this.state.currentlyEditedProject}/members/${userId}`)
            .then(() => {
                this.loadCurrentlyEditedProjectData();
            })
    }

    getCallbackOnDeleteProject = projectId => () => {
        axios.delete(`http://localhost:8080/projects/${projectId}`)
            .then(() => {
                this.loadCurrentlyEditedProjectData();
            })
    }

    render() {
        return (
            <>
                <div className="settings-container">
                    <ProjectSettingsSection sectionName="Projects">
                        <div className="small-margin-top" style={
                            {
                                display: "flex",
                                flexDirection: "row"
                            }}>
                            <List style={
                                {
                                    width: "300px"
                                }
                            }>
                                {this.state.projects.map(project =>
                                    <ListItem>
                                        <ListItemText primary={project.name} />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={this.getCallbackOnEditProject(project.id)}>
                                                <PeopleIcon />
                                            </IconButton>
                                            <IconButton onClick={this.getCallbackOnDeleteProject(project.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>)}
                            </List>
                            <Button variant="contained"
                                style={{
                                    height: "50px"
                                }}
                                onClick={
                                    () => {
                                        this.setState({
                                            isCreateProjectPopoverOpen: true
                                        })
                                    }}>Create</Button>
                        </div>
                    </ProjectSettingsSection>
                </div>
                {this.state.isCreateProjectPopoverOpen ?
                    <CreateProjectPopover
                        handleCancel={() => { this.setState({ isCreateProjectPopoverOpen: false }) }}
                        handleOk={this.handleCreateProject} />
                    :
                    null
                }
                {this.state.currentlyEditedProject ?
                    <ViewAndEditProjectUsers
                        projectId={this.state.currentlyEditedProject}
                        handleOk={() => {
                            this.setState({
                                currentlyEditedProject: null
                            })
                        }}
                        assignedUsers={this.state.currentlyEditedProjectAssignedUsers}
                        unassignedUsers={this.state.currentlyEditedProjectUnassignedUsers}
                        callbackFactoryForAssignUser={this.getCallbackForAddUserToProject}
                        callbackFactoryForUnassignUser={this.getCallbackForRemoveUserFromProject} />
                    :
                    null
                }
            </>
        )
    }
}

const mapStateToProps = state => ({
    labels: state.bugs.labels,
    currentProjectId: state.bugs.currentProjectId,
    doesNewLabelAlreadyExist: state.bugs.doesNewLabelAlreadyExist,
    isUserPM: state.security.isPM,
    predefinedRoles: state.security.predefinedRoles
});

export default connect(mapStateToProps)(withStyles()(GlobalSettings));

class ViewAndEditProjectUsers extends React.PureComponent {

    render() {
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="lg"
                aria-labelledby="confirmation-dialog-title"
                open={true}
                onKeyDown={this.onKeyDownDialog}
            >
                <DialogTitle id="confirmation-dialog-title">Edit project members</DialogTitle>
                <DialogContent>
                    <div className="gs-wrapper">
                        <section className="gs__assigned-users">
                            <List>
                                {this.props.assignedUsers.map(assignedUser =>
                                    <ListItem key={assignedUser.id}>
                                        <ListItemText primary={assignedUser.name} />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={this.props.callbackFactoryForUnassignUser(assignedUser.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )}
                            </List>
                        </section>
                        <section className="gs__unassigned-users">
                            <List>
                                {this.props.unassignedUsers.map(unassignedUser =>
                                    <ListItem key={unassignedUser.id}>
                                        <ListItemText primary={unassignedUser.name} />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={this.props.callbackFactoryForAssignUser(unassignedUser.id)}>
                                                <AddIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )}
                            </List>
                        </section>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleOk} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
