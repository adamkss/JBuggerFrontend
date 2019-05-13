import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { Input, Typography } from '@material-ui/core';

class ChangeUserPasswordDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newPassword: ""
    }
  }

  handleOk = () => {
    this.props.onConfirm(this.state.newPassword);
  };

  handleInputChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
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
        <DialogTitle id="confirmation-dialog-title">Please change your temporary password.</DialogTitle>
        <DialogContent>
          <div className="flexbox-vertical-centered">
            <Input
              value={this.state.newPassword}
              placeholder="New password"
              onChange={this.handleInputChange('newPassword')} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleOk}
            color="primary"
            disabled={this.state.newPassword.length === 0}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ChangeUserPasswordDialog;