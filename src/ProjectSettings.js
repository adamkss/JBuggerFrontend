import React, { Component } from 'react'
import './ProjectSettings.css';

import { connect } from 'react-redux';
import { Paper, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from '@material-ui/core';

import ProjectSettingsSection from './ProjectSettingsSection';
import LabelShort from './LabelShort';
import NewLabelDialog from './popovers/NewLabelDialog';
import { createNewLabel, startCreatingNewLabel, labelCreationAbandoned } from './redux-stuff/actions/actionCreators';
import axios from 'axios';
class ProjectSettings extends Component {
    state = {
        isNewLabelDialogOpen: false,
        allUsers: []
    }

    componentDidMount = () => {
        if (this.props.isUserPM) {
            axios.get("http://localhost:8080/users/adminInfo")
                .then(({ data }) => {
                    this.setState({
                        allUsers: data
                    })
                })
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
        this.props.dispatch(startCreatingNewLabel(newLabelName, newLabelColor, this.closeNewLabelDialog));
    }

    newValueThenWrongWasInserted = () => {
        this.props.dispatch(labelCreationAbandoned());
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
                        <ProjectSettingsSection sectionName="Users">
                            <Paper style={{
                                maxHeight: "600px",
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

            </>
        )
    }
}

const mapStateToProps = state => ({
    labels: state.bugs.labels,
    doesNewLabelAlreadyExist: state.bugs.doesNewLabelAlreadyExist,
    isUserPM: state.security.isPM
});

export default connect(mapStateToProps)(ProjectSettings);