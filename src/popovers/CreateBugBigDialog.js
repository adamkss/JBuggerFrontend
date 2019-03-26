import React, { Component } from 'react'
import Popover from '@material-ui/core/Popover';
import { Dialog, DialogContent, DialogActions, Button, Typography, Divider, List, ListItem, Input, TextField } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DateRange from '@material-ui/icons/DateRange';
import ShortText from '@material-ui/icons/ShortText';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Delete from '@material-ui/icons/Delete';
import Label from '@material-ui/icons/Label';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Attachment from '@material-ui/icons/Attachment';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getUserNames } from '../redux-stuff/actions/actionCreators';

import LabelShort from '../LabelShort';

class CreateBugBigDialog extends Component {

  state = {
    bugTitle: "Unnamed bug",
    bugDescription: "",
    assignedToUser: {
      name: null,
      id: null,
      username: null
    },
    targetDate: null,
    severity: null,
    status: {
      statusName: null
    },
    labels: [],
    selectAssignedToUserPopoverAnchorEl: null,
    selectTargetDatePopoverAnchorEl: null,
    selectSeverityPopoverAnchorEl: null,
    selectStatusPopoverAnchorEl: null,
    selectLabelsAnchorEl: null,
    deleteLabelPopoverAnchorEl: null,
    labelToPotentiallyDelete: null
  };

  componentDidMount = () => {
    this.setState({
      status: this.props.statuses ? this.props.statuses[0] : null
    })
  }

  componentDidUpdate = (oldProps) => {
    if (oldProps.statuses != this.props.statuses) {
      this.setState({
        status: this.props.statuses[0]
      })
    }
  }

  handleStateValueChange = (nameOfStateElement) => (event) => {
    this.setState({
      [nameOfStateElement]: event.target.value
    })
  }

  onKeyDownOnInput = (event) => {
    if (event.keyCode == 13) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onKeyDownDialog = (event) => {
    if (event.keyCode === 27) {
      this.props.handleCancel();
    }
  }

  onAssignUserButtonClick = (event) => {
    this.props.dispatch(getUserNames());
    this.setState({
      selectAssignedToUserPopoverAnchorEl: event.currentTarget
    })
  }

  onAssignToUserPopoverClose = () => {
    this.setState({
      selectAssignedToUserPopoverAnchorEl: null
    })
  }

  onTargetDateButtonClick = (event) => {
    this.setState({
      selectTargetDatePopoverAnchorEl: event.currentTarget
    })
  }

  onTargetDatePopoverClose = () => {
    this.setState({
      selectTargetDatePopoverAnchorEl: null
    })
  }

  onSeverityButtonClick = (event) => {
    this.setState({
      selectSeverityPopoverAnchorEl: event.currentTarget
    })
  }

  onSeverityPopoverClose = () => {
    this.setState({
      selectSeverityPopoverAnchorEl: null
    })
  }

  assignedToUserSelected = (selectedUser) => {
    this.setState({
      assignedToUser: { ...selectedUser }
    })
    this.onAssignToUserPopoverClose();
  }

  onTargetDateChange = (event) => {
    this.setState({
      targetDate: event.target.value
    })
  }

  onSeveritySelected = (severity) => {
    this.setState({
      severity
    })
  }

  onSelectLabelsButtonClick = (event) => {
    this.setState({
      selectLabelsPopoverAnchorEl: event.currentTarget
    })
  }

  onSelectLabelsPopoverClose = () => {
    this.setState({
      selectLabelsPopoverAnchorEl: null
    })
  }

  onLabelSelected = (label) => {
    this.setState(state => ({
      labels: [...state.labels, { ...label }]
    }))
  }

  getOnLabelClickedCallback = label => event => {
    this.setState({
      labelToPotentiallyDelete: label,
      deleteLabelPopoverAnchorEl: event.currentTarget
    })
  }

  onDeleteLabelPopoverClose = () => {
    this.setState({
      deleteLabelPopoverAnchorEl: null
    })
  }

  deleteSelectedLabel = () => {
    this.setState(state => ({
      labelToPotentiallyDelete: null,
      labels: state.labels.filter(label => state.labelToPotentiallyDelete.labelName !== label.labelName)
    }))
    this.onDeleteLabelPopoverClose();
  }

  onNewAttachmentButtonPressed = () => {
    this.setState(state => ({
      filesToUploadCount: state.filesToUploadCount + 1
    }))
  }

  handleOk = () => {
    this.props.handleCreateBug(
      this.state.bugTitle,
      this.state.bugDescription,
      this.state.assignedToUser,
      this.state.severity,
      this.state.targetDate,
      this.state.status,
      this.state.labels
    );
  }

  onStatusButtonClick = event => {
    this.setState({
      selectStatusPopoverAnchorEl: event.currentTarget
    })
  }

  onStatusSelected = status => {
    this.setState({
      status
    })
  }

  onStatusPopoverClose = () => {
    this.setState({
      selectStatusPopoverAnchorEl: null
    })
  }

  render() {
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="confirmation-dialog-title"
        open={true}
        maxWidth="lg"
        onKeyDown={this.onKeyDownDialog}
      >
        <DialogContent>
          <div className="flexbox-vertical">
            <CustomTextAreaForBugTextInput
              title
              value={this.state.bugTitle}
              onChange={this.handleStateValueChange('bugTitle')}
              placeholder="Write a bug name"
              onKeyDown={this.onKeyDownOnInput} />

            <NewBugSection marginBottom>

              <CustomButtonForSelection
                onClick={this.onAssignUserButtonClick}
                title="Assigned to"
              >
                <AccountCircle className="color-gray small-margin-right" />
                <Typography variant="subtitle2">
                  {this.state.assignedToUser.name || "Not assigned"}
                </Typography>
              </CustomButtonForSelection>

              <CustomButtonForSelection marginLeft
                onClick={this.onTargetDateButtonClick}
                title="Target date">
                <DateRange className="color-gray small-margin-right" />
                <Typography variant="subtitle2">
                  {this.state.targetDate || "No target date"}
                </Typography>
              </CustomButtonForSelection>

              <CustomButtonForSelection marginLeft
                onClick={this.onSeverityButtonClick}
                title="Severity">
                <ErrorOutline className="color-gray small-margin-right" />
                <Typography variant="subtitle2">
                  {this.state.severity || "No severity selected"}
                </Typography>
              </CustomButtonForSelection>

              <CustomButtonForSelection marginLeft
                onClick={this.onStatusButtonClick}
                title="Status">
                <ViewColumn className="color-gray small-margin-right" />
                <Typography variant="subtitle2">
                  {this.state.status.statusName || "No status selected"}
                </Typography>
              </CustomButtonForSelection>
            </NewBugSection>

            <Divider />

            <NewBugSection alignedToUpperButtons marginTop>
              <ShortText className="color-gray small-margin-right" />
              <CustomTextAreaForBugTextInput
                placeholder="Description..."
                onChange={this.handleStateValueChange('bugDescription')}
                value={this.state.bugDescription} />
            </NewBugSection>

            <NewBugSection alignedToUpperButtons marginTop>
              <CustomButtonForSelection
                onClick={this.onSelectLabelsButtonClick}>
                <Label className="color-gray small-margin-right" />
                <Typography variant="subtitle2">Add label</Typography>
              </CustomButtonForSelection>
              <div className="flexbox-horizontal flex-wrap small-margin-top">
                {this.state.labels.map(label =>
                  <LabelShort
                    key={label.labelName}
                    text={label.labelName}
                    backgroundColor={label.backgroundColor}
                    selectable
                    selected={true}
                    onClick={this.getOnLabelClickedCallback(label)} />)}
              </div>
            </NewBugSection>
          </div>

          <SelectAssignedToUserPopover
            open={Boolean(this.state.selectAssignedToUserPopoverAnchorEl)}
            anchorEl={this.state.selectAssignedToUserPopoverAnchorEl}
            onClose={this.onAssignToUserPopoverClose}
            selectableUsers={this.props.users}
            assignedToUserSelected={this.assignedToUserSelected} />

          <SelectTargetDatePopover
            open={Boolean(this.state.selectTargetDatePopoverAnchorEl)}
            anchorEl={this.state.selectTargetDatePopoverAnchorEl}
            onClose={this.onTargetDatePopoverClose}
            targetDate={this.state.targetDate}
            handleTargetDateChange={this.onTargetDateChange} />

          <SelectSeverityPopover
            open={Boolean(this.state.selectSeverityPopoverAnchorEl)}
            anchorEl={this.state.selectSeverityPopoverAnchorEl}
            onClose={this.onSeverityPopoverClose}
            severities={this.props.severities}
            onSeveritySelected={this.onSeveritySelected} />

          <SelectStatusPopover
            open={Boolean(this.state.selectStatusPopoverAnchorEl)}
            anchorEl={this.state.selectStatusPopoverAnchorEl}
            onClose={this.onStatusPopoverClose}
            statuses={this.props.statuses}
            onStatusSelected={this.onStatusSelected} />

          <SelectLabelsPopover
            open={Boolean(this.state.selectLabelsPopoverAnchorEl)}
            anchorEl={this.state.selectLabelsPopoverAnchorEl}
            onClose={this.onSelectLabelsPopoverClose}
            labels={this.props.labels}
            alreadySelectedLabels={this.state.labels}
            onLabelSelected={this.onLabelSelected} />

          <DeleteLabelPopover
            open={Boolean(this.state.deleteLabelPopoverAnchorEl)}
            anchorEl={this.state.deleteLabelPopoverAnchorEl}
            onClose={this.onDeleteLabelPopoverClose}
            onDeleteLabel={this.deleteSelectedLabel} />

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

const mapStateToProps = state => ({
  severities: state.severities,
  statuses: state.statuses,
  users: state.usernames,
  labels: state.labels,
  statuses: state.statuses
})

export default connect(mapStateToProps)(CreateBugBigDialog);

const CustomTextAreaForBugTextInput = styled.textarea`
${props => props.title ? "height: 40px;" : "height: 80px;"}
width: 600px;
border-color: transparent;
border-radius: 5px;
transition: border-color 300ms;
resize: none;
font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif;
font-size: ${props => props.title ? "24px" : "16px"};
font-weight: ${props => props.title ? "500" : "200"};
line-height: ${props => props.title ? "32px" : "20px"};
${props => props.title ? "overflow: hidden;" : ""}
margin-bottom: 8px;

&:hover{
  border-color: #d5dce0;
}

&:focus{
  outline: none;
  border-color: #d5dce0;
}
`;

const CustomButtonForSelection = styled.div`
height: 30px;
padding: 5px;
border: solid 1px transparent;
transition: border-color 300ms;
border-radius: 10px;
display:flex;
flex-direction:row;
justify-content:center;
align-items:center;
align-content:center;
cursor: pointer;
margin-left: ${props => props.marginLeft ? "8px;" : ""};

&:hover{
  border-color: #d5dce0;
}
`

const NewBugSection = styled.div`
padding-left: ${props => props.alignedToUpperButtons ? "5px" : ""};
display: flex;
flex-direction: row;
margin-bottom: ${props => props.marginBottom ? "8px" : ""};
margin-top: ${props => props.marginTop ? "8px" : ""};
`

class SelectAssignedToUserPopover extends React.PureComponent {

  state = {
    filterString: ""
  }

  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      this.props.onClose();
    }
  }

  getOnUserSelected = (user) => () => {
    this.props.assignedToUserSelected(user);
  }

  render() {
    const filterStringUppercase = this.state.filterString.toUpperCase();
    let filteredUsers = this.props.selectableUsers.filter((user) => {
      if (user.username.toUpperCase().includes(filterStringUppercase)
        || user.name.toUpperCase().includes(filterStringUppercase))
        return true;

      return false;
    })

    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onKeyDown={this.onKeyDown}
      >
        <div style={{ maxHeight: "300px" }} className="flexbox-vertical-centered">
          <Input
            placeholder="Search text..."
            autoFocus
            value={this.state.filterString}
            onChange={(event) => {
              this.setState({
                filterString: event.target.value
              })
            }}
            style={{ width: "100%", paddingLeft: "5px" }}
            disableUnderline
          />
          <Divider style={{ width: "100%" }} />
          {filteredUsers.length > 0 ?
            <List component="nav" style={{ overflow: "auto" }}>
              {filteredUsers.map(selectableUser =>
                <ListItem
                  button
                  onClick={this.getOnUserSelected(selectableUser)}
                  style={{ cursor: "pointer" }}
                  key={selectableUser.id}>
                  {selectableUser.username}-{selectableUser.name}
                </ListItem>)}
            </List>
            :
            <Typography variant="subtitle2">
              No users.
          </Typography>
          }
        </div>
      </Popover>
    )
  }
}

class SelectTargetDatePopover extends React.PureComponent {

  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      this.props.onClose();
    }
    if (event.keyCode === 13) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onKeyDown={this.onKeyDown}
      >
        <div
          style={{ padding: "10px" }}>
          <TextField
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={this.props.targetDate}
            onChange={this.props.handleTargetDateChange}
          />
        </div>
      </Popover>
    )
  }
}

class SelectSeverityPopover extends React.PureComponent {

  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      this.props.onClose();
    }
  }

  getOnSeveritySelect = severity => () => {
    this.props.onSeveritySelected(severity);
    this.props.onClose();
  }

  render() {
    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onKeyDown={this.onKeyDown}
      >
        <div>
          {this.props.severities.length > 0 ?
            <List component="nav" style={{ overflow: "auto" }}>
              {this.props.severities.map(severity =>
                <ListItem
                  button
                  onClick={this.getOnSeveritySelect(severity)}
                  style={{ cursor: "pointer" }}
                  key={severity}>
                  {severity}
                </ListItem>)}
            </List>
            :
            <Typography variant="subtitle2">
              No severities.
          </Typography>
          }
        </div>
      </Popover>
    )
  }
}

class SelectStatusPopover extends React.PureComponent {

  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      this.props.onClose();
    }
  }

  getOnStatusSelect = status => () => {
    this.props.onStatusSelected(status);
    this.props.onClose();
  }

  render() {
    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onKeyDown={this.onKeyDown}
      >
        <div>
          {this.props.statuses.length > 0 ?
            <List component="nav" style={{ overflow: "auto" }}>
              {this.props.statuses.map(status =>
                <ListItem
                  button
                  onClick={this.getOnStatusSelect(status)}
                  style={{ cursor: "pointer" }}
                  key={status.id}>
                  {status.statusName}
                </ListItem>)}
            </List>
            :
            <Typography variant="subtitle2">
              No statuses.
          </Typography>
          }
        </div>
      </Popover>
    )
  }
}
class SelectLabelsPopover extends React.PureComponent {

  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      this.props.onClose();
    }
  }

  onLabelSelected = label => event => {
    this.props.onClose();
    this.props.onLabelSelected(label);
  }

  isLabelNotSelectedYet = label => {
    if (this.props.alreadySelectedLabels
      .filter(selectedLabel => selectedLabel.labelName === label.labelName).length === 0)
      return true;
    return false;
  }

  render() {
    const labelsNotSelectedYet = this.props.labels.filter(this.isLabelNotSelectedYet);
    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onKeyDown={this.onKeyDown}
      >
        <div style={{ padding: "5px" }}>
          {labelsNotSelectedYet.length > 0 ?
            <div className="flexbox-horizontal flex-wrap">
              {labelsNotSelectedYet.map(label =>
                <LabelShort
                  selectable
                  selected={true}
                  key={label.labelName}
                  text={label.labelName}
                  backgroundColor={label.backgroundColor}
                  onClick={this.onLabelSelected(label)} />)}
            </div>
            :
            <Typography variant="subtitle2">
              No available labels to select left.
          </Typography>
          }
        </div>
      </Popover>
    )
  }
}

class DeleteLabelPopover extends React.PureComponent {

  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      this.props.onClose();
    }
  }

  render() {
    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 38,
          horizontal: 'center',
        }}
        onKeyDown={this.onKeyDown}
      >
        <div className="flexbox-horizontal" style={{ padding: "5px", cursor: "pointer", alignItems: "center" }} onClick={this.props.onDeleteLabel}>
          <Typography>Delete</Typography>
          <Delete className="color-gray" />
        </div>
      </Popover>
    )
  }
}