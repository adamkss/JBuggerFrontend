import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { Typography, Input } from '@material-ui/core';

class NewSwimlaneNameInputDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newSwimLaneName: this.props.initialSwimlaneName
    }
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  handleOk = () => {
    this.props.onConfirm(this.state.newSwimLaneName);
  };

  handleInputChange = (event) => {
    this.setState({
      newSwimLaneName: event.target.value
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
        <DialogTitle id="confirmation-dialog-title">New name</DialogTitle>
        <DialogContent>
          <div className="flexbox-vertical-centered">
            <Input
              value={this.state.newSwimLaneName}
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

export default NewSwimlaneNameInputDialog;