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

class GlobalSettings extends Component {
    state = {

    }

    render() {
        return (
            <>
                <div className="settings-container">
                    <ProjectSettingsSection sectionName="Projects">
                        <div className="settings-container__labels-container small-margin-top">

                        </div>
                    </ProjectSettingsSection>

                </div>
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

export default connect(mapStateToProps)(GlobalSettings);