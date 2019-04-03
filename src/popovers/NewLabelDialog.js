import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { Input, Typography } from '@material-ui/core';

import ColorSelecter from '../ColorSelecter';

class NewLabelDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newLabelName: "",
      newLabelColor: null
    }
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  handleOk = () => {
    this.props.onConfirm(this.state.newLabelName, this.state.newLabelColor || "#4527a0");
  };

  handleInputChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
    if (this.props.doesLabelAlreadyExist) {
      this.props.newValueThenWrongWasInserted();
    }
  }

  render() {

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="s"
        aria-labelledby="confirmation-dialog-title"
        open={true}
      >
        <DialogTitle id="confirmation-dialog-title">New label</DialogTitle>
        <DialogContent>
          <div className="flexbox-vertical-centered">
            <Input
              value={this.state.newLabelName}
              placeholder="New label name"
              onChange={this.handleInputChange('newLabelName')} />
            <ColorSelecter
              onChange={this.handleInputChange('newLabelColor')}
              selectedColor={this.state.newLabelColor} />
            {this.props.doesLabelAlreadyExist ?
              <Typography className="with-margin-top" style={{
                fontWeight: "600",
                color: "#d32f2f"
              }}>
                Label name already exists.
              </Typography>
              :
              null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.handleOk}
            color="primary"
            disabled={this.state.newLabelName.length === 0}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NewLabelDialog;