import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import ColorSelecter from '../ColorSelecter';

class RecolorSwimlaneInputDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newSwimLaneColor: this.props.initialSwimlaneColor
    }
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  handleOk = () => {
    this.props.onConfirm(this.state.newSwimLaneColor);
  };

  handleInputChange = (event) => {
    this.setState({
      newSwimLaneColor: event.target.value
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
        <DialogTitle id="confirmation-dialog-title">New color</DialogTitle>
        <DialogContent>
          <div className="flexbox-vertical-centered">
            <ColorSelecter
              onChange={this.handleInputChange}
              selectedColor={this.state.newSwimLaneColor} />
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

export default RecolorSwimlaneInputDialog;