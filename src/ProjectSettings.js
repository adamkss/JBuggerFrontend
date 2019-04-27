import React, { Component } from 'react'
import './ProjectSettings.css';

import { connect } from 'react-redux';
import { Paper, Input, Button, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Select, MenuItem } from '@material-ui/core';

import ProjectSettingsSection from './ProjectSettingsSection';
import LabelShort from './LabelShort';
import NewLabelDialog from './popovers/NewLabelDialog';
import { createNewLabel, startCreatingNewLabel, labelCreationAbandoned } from './redux-stuff/actions/actionCreators';
import axios from 'axios';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
class ProjectSettings extends Component {
    state = {
        isNewLabelDialogOpen: false,
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
        if (this.props.isUserPM) {
            this.loadUsers();
        }
    }

    openNewLabelDialog = () => {
        this.setState({
            isNewLabelDialogOpen: true
        })
    }

    closeNewLabelDialog = () => {
        this.setState({
            isNewLabelDialogOpen: false
        })
    }

    onNewLabelDialogCancel = () => {
        this.closeNewLabelDialog();
        this.props.dispatch(labelCreationAbandoned())
    }

    onNewLabelDialogConfirm = (newLabelName, newLabelColor) => {
        this.props.dispatch(startCreatingNewLabel(
            this.props.currentProjectId,
            newLabelName,
            newLabelColor,
            this.closeNewLabelDialog));
    }

    newValueThenWrongWasInserted = () => {
        this.props.dispatch(labelCreationAbandoned());
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
                    <ProjectSettingsSection sectionName="Labels">
                        <div className="settings-container__labels-container small-margin-top">
                            {this.props.labels.map(label =>
                                <LabelShort key={label.labelName} text={label.labelName} backgroundColor={label.backgroundColor} />)}
                            <Button onClick={this.openNewLabelDialog}> New label</Button>
                        </div>
                    </ProjectSettingsSection>

                    {this.props.isUserPM ?
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

                {this.state.isNewLabelDialogOpen ?
                    <NewLabelDialog
                        onCancel={this.onNewLabelDialogCancel}
                        onConfirm={this.onNewLabelDialogConfirm}
                        doesLabelAlreadyExist={this.props.doesNewLabelAlreadyExist}
                        newValueThenWrongWasInserted={this.newValueThenWrongWasInserted} />
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
    predefinedRoles: state.security.predefinedRoles
});

export default connect(mapStateToProps)(ProjectSettings);

class NewUserDialog extends React.PureComponent {
    state = {
        name: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: ''
    }

    handleCancel = () => {
        this.props.onCancel();
    };

    handleOk = () => {
        this.props.onConfirm({
            name: this.state.name,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            role: this.state.role,
            password: this.state.password
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
                        <Input
                            value={this.state.password}
                            placeholder="Password:"
                            onChange={this.handleInputChange('password')} />
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