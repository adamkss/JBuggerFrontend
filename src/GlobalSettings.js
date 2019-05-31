import React, { Component } from 'react'
import './ProjectSettings.css';

import { connect } from 'react-redux';
import {Input, Button, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Select, MenuItem, List, ListItemSecondaryAction, IconButton, Icon } from '@material-ui/core';
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
import { Paper } from '@material-ui/core';
import './GlobalSettings.css';

class GlobalSettings extends Component {
    state = {
        projects: [],
        isCreateProjectPopoverOpen: false,
        currentlyEditedProject: null,
        currentlyEditedProjectAssignedUsers: [],
        currentlyEditedProjectUnassignedUsers: [],
        isCreateUserDialogOpen: false,
        allUsers: []
    }

    loadUsers = () => {
        axios.get("http://localhost:8080/users/adminInfo")
            .then(({ data }) => {
                this.setState({
                    allUsers: data
                })
            })
    }

    componentDidMount = () => {
        axios.get(`http://localhost:8080/projects`)
            .then(({ data: projects }) => {
                this.setState({
                    projects
                })
            })
        if (this.props.isUserAdmin) {
            this.loadUsers();
        }
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

    onCreateUserPress = () => {
        this.setState({
            isCreateUserDialogOpen: true
        })
    }

    closeCreateUserDialog = () => {
        this.setState({
            isCreateUserDialogOpen: false
        })
    }

    onCreateUserConfirm = (newUser) => {
        axios.post("http://localhost:8080/users", newUser)
            .then(({ data: newUser }) => {
                this.loadUsers();
            })
        this.closeCreateUserDialog();
    }

    onCreateUserCancel = () => {
        this.closeCreateUserDialog();
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
                    {this.props.isUserAdmin ?
                        <ProjectSettingsSection sectionName="Users" verticalContent>
                            <Paper style={{
                                maxHeight: "400px",
                                height: "40vh",
                                overflow: "auto",
                                maxWidth: "1250px",
                                marginTop: "10px"
                            }}>

                                <Table style={{
                                    width: "100%"
                                }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Phone number</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Username</TableCell>
                                            <TableCell>Bugs assigned</TableCell>
                                            <TableCell>Activated</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.allUsers.map(user => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.id}</TableCell>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.phoneNumber}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell>{user.username}</TableCell>
                                                <TableCell>{user.bugsAssignedToTheUserIds}</TableCell>
                                                <TableCell>
                                                    <Checkbox checked={user.userActivated}></Checkbox>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                            <div>
                                <Button variant="contained" style={{ marginTop: "10px" }} onClick={this.onCreateUserPress} >Create user</Button>
                            </div>
                        </ProjectSettingsSection>
                        :
                        null
                    }
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
                {this.state.isCreateUserDialogOpen ?
                    <NewUserDialog
                        onConfirm={this.onCreateUserConfirm}
                        onCancel={this.onCreateUserCancel}
                        roles={this.props.predefinedRoles}
                    />
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
    isUserAdmin: state.security.isAdmin,
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



class NewUserDialog extends React.PureComponent {
    state = {
        name: '',
        email: '',
        phoneNumber: '',
        role: ''
    }

    handleCancel = () => {
        this.props.onCancel();
    };

    handleOk = () => {
        this.props.onConfirm({
            name: this.state.name,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            role: this.state.role
        });
    };

    handleInputChange = inputName => event => {
        this.setState({
            [inputName]: event.target.value
        })
    }

    render() {
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="md"
                aria-labelledby="confirmation-dialog-title"
                open={true}
            >
                <DialogTitle id="confirmation-dialog-title">Add user</DialogTitle>
                <DialogContent>
                    <div className="flexbox-vertical-centered">
                        <Input
                            value={this.state.name}
                            placeholder="Name:"
                            onChange={this.handleInputChange('name')} />
                        <Input
                            value={this.state.email}
                            placeholder="Email:"
                            onChange={this.handleInputChange('email')} />
                        <Input
                            value={this.state.phoneNumber}
                            placeholder="Phone number:"
                            onChange={this.handleInputChange('phoneNumber')} />
                        <Select
                            value={this.state.role}
                            onChange={this.handleInputChange('role')}
                            style={{
                                width: "100%"
                            }}
                        >
                            {this.props.roles.map(role =>
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            )}
                        </Select>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        Cancel
                     </Button>
                    <Button
                        onClick={this.handleOk}
                        color="primary">
                        Ok
                     </Button>
                </DialogActions>
            </Dialog>
        )
    }
}