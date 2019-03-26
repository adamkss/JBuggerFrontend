import React, { Component } from 'react'
import './ProjectSettings.css';

import { connect } from 'react-redux';
import { Typography, Button } from '@material-ui/core';

import ProjectSettingsSection from './ProjectSettingsSection';
import LabelShort from './LabelShort';
import NewLabelDialog from './popovers/NewLabelDialog';
import { createNewLabel, startCreatingNewLabel } from './redux-stuff/actions/actionCreators';

class ProjectSettings extends Component {
    state = {
        isNewLabelDialogOpen: false
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
    }

    onNewLabelDialogConfirm = (newLabelName, newLabelColor) => {
        this.props.dispatch(startCreatingNewLabel(newLabelName, newLabelColor));
        this.closeNewLabelDialog();
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

                    <ProjectSettingsSection sectionName="Users">
                    </ProjectSettingsSection>
                </div>

                {this.state.isNewLabelDialogOpen ?
                    <NewLabelDialog
                        onCancel={this.onNewLabelDialogCancel}
                        onConfirm={this.onNewLabelDialogConfirm} />
                    :
                    null
                }

            </>
        )
    }
}

const mapStateToProps = state => ({
    labels: state.labels
});

export default connect(mapStateToProps)(ProjectSettings);