import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { Typography, Input } from '@material-ui/core';

class NewBugTitleDialog extends React.Component {

  state = {
    newBugTitle: ""
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  handleOk = () => {
    this.props.onConfirm(this.state.newBugTitle);
  };

  handleInputChange = (event) => {
    this.setState({
      newBugTitle: event.target.value
    })
  }

  componentDidMount = () => {
    this.setState({
      newBugTitle: this.props.initialBugTitle
    })
  }

  render() {

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={true}
      >
        <DialogTitle id="confirmation-dialog-title">New bug title</DialogTitle>
        <DialogContent>
          <div className="flexbox-vertical-centered">
            <Input
              value={this.state.newBugTitle}
              onChange={this.handleInputChange} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NewBugTitleDialog;