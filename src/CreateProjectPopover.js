import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import React, { Component } from 'react'
import { Input } from '@material-ui/core';
export default class CreateProjectPopover extends Component {
    state = {
        newProjectName: "",
    }
    handleOk = () => {
        this.props.handleOk(this.state.newProjectName);
    }

    render() {
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="md"
                aria-labelledby="confirmation-dialog-title"
                open={true}
                onKeyDown={this.onKeyDownDialog}
            >
                <DialogTitle id="confirmation-dialog-title">New project</DialogTitle>
                <DialogContent>
                    <div>
                        <Input
                            type="text"
                            placeholder="Project name..."
                            value={this.state.newProjectName} onChange={(event) => {
                                this.setState({
                                    newProjectName: event.target.value
                                })
                            }}
                        ></Input>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleCancel} color="primary">
                        Cancel
          </Button>
                    <Button onClick={this.handleOk} color="primary">
                        Ok
          </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

//handleCreateNewBug
