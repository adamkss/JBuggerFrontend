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
        allUsers: []
    }

    
    componentDidMount = () => {
      
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
    currentProjectId: state.bugs.currentProjectId,
    doesNewLabelAlreadyExist: state.bugs.doesNewLabelAlreadyExist,
    isUserPM: state.security.isPM,
    predefinedRoles: state.security.predefinedRoles
});

export default connect(mapStateToProps)(ProjectSettings);
