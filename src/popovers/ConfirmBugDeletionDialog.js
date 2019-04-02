import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

class ConfirmBugColumnDeletionDialog extends React.Component {

  handleCancel = () => {
    this.props.onCancel();
  };

  handleOk = () => {
    this.props.onConfirm();
  };

  render() {

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={true}
      >
        <DialogTitle id="confirmation-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this bug?
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

export default ConfirmBugColumnDeletionDialog;