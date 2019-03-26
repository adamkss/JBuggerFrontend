import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components';
import getCaretCoordinates from 'textarea-caret';
import { Typography } from '@material-ui/core';
import axios from 'axios';

const AtSignUserChooserWrapperDiv = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  border-radius: 5px;
  transition: opacity 0.3s;
  background-color: white;
  box-shadow: 0px 0px 10px 0px rgba(182, 182, 182, 0.75);
`;

const SelectableUser = styled.div`
  padding: 5px;
  cursor: pointer;
  ${props => props.isSelected ?
    "background-color:blue;"
    :
    null
  }
    ${props => props.isFirstInList ?
    "border-top-left-radius: 5px;"
    :
    null}
    ${props => props.isFirstInList ?
    "border-top-right-radius: 5px;"
    :
    null}
    ${props => props.isLastInList ?
    "border-bottom-left-radius: 5px;"
    :
    null}
      ${props => props.isLastInList ?
    "border-bottom-right-radius: 5px;"
    :
    null}
`
const getPostitionAfterAtSignBeforeLastWord = (text, lastPosition) => {
  let i = lastPosition - 1;

  while (i >= 0) {
    if (text[i] === '@') {
      return i + 1;
    }
    if (text[i] === ' ' || text[i] === '\n' || text[i] === '\r\n')
      break;
    i--;
  }

  return -1;
}

const getLastWordAfterLastAtSign = (text, lastPosition) => {
  let i = lastPosition - 1;

  let lastWord = null;

  while (i >= 0) {
    if (text[i] === '@') {
      lastWord = text.substr(i + 1, lastPosition - i - 1);
      break;
    }
    if (text[i] === ' ' || text[i] === '\n' || text[i] === '\r\n')
      break;
    i--;
  }

  if (lastWord === "@")
    return null;

  return lastWord;
}

const replaceLastWordAfterLastAtSign = (text, lastPosition, newWord) => {
  let positionAfterAtSign = getPostitionAfterAtSignBeforeLastWord(text, lastPosition);

  let textIncludingAtSign = text.slice(0, positionAfterAtSign);
  let textToRemove = getLastWordAfterLastAtSign(text, lastPosition);
  let textAfterName = text.slice(positionAfterAtSign + textToRemove.length);

  return textIncludingAtSign + newWord + textAfterName;
}

class CreateCommentDialog extends React.Component {

  constructor(props) {
    super(props);
    this.textFieldRef = React.createRef();
  }

  state = {
    commentMessage: "",
    isPotentialMentionedUsersOpen: false,
    potentialMentionedUsers: [],
    topCoordinateAssignUser: 0,
    leftCoordinateAssignUser: 0,
    chosenUserIndex: 0,
    selectionEnd: null
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  handleOk = () => {
    this.props.onDone(this.state.commentMessage);
  };

  clearPotentialUsersByPartialName = () => {
    this.setState({
      isPotentialMentionedUsersOpen: false,
      potentialMentionedUsers: [],
      chosenUserIndex: 0
    })
  }

  getPotentialUsersByPartialName = (partialUsername) => {
    if (this.getPotentialUsersByPartialNameCancellationToken) {
      this.getPotentialUsersByPartialNameCancellationToken.cancel('Newer name came!');
    }

    this.getPotentialUsersByPartialNameCancellationToken = axios.CancelToken.source();

    axios.get(`http://localhost:8080/users/byFilterStringInName/${partialUsername}`, {
      cancelToken: this.getPotentialUsersByPartialNameCancellationToken.token
    })
      .then(resp => {
        if (resp.data.length > 0) {
          let coordinates = getCaretCoordinates(this.textFieldRef.current, this.textFieldRef.current.selectionEnd);
          this.setState({
            isPotentialMentionedUsersOpen: true,
            potentialMentionedUsers: resp.data,
            topCoordinateAssignUser: coordinates.top + coordinates.height,
            leftCoordinateAssignUser: coordinates.left,
            chosenUserIndex: 0
          })
        } else {
          this.clearPotentialUsersByPartialName();
        }
      })
  }

  onCommentMessageChange = (event) => {
    this.setState({
      commentMessage: event.target.value
    })
    let lastWord = getLastWordAfterLastAtSign(event.target.value, event.target.selectionEnd);
    if (lastWord && lastWord.length >= 2) {
      this.getPotentialUsersByPartialName(lastWord);
    } else {
      this.clearPotentialUsersByPartialName();
    }
    this.setState({
      selectionEnd: event.target.selectionEnd
    })
  }

  onKeyDownInput = (event) => {
    if (this.state.isPotentialMentionedUsersOpen) {
      let isUpPressed = event.keyCode == 38;
      let isDownPressed = event.keyCode == 40;
      let isEscapePressed = event.keyCode == 27;
      let isEnterPressed = event.keyCode == 13;

      if (isUpPressed || isDownPressed || isEscapePressed || isEnterPressed) {
        event.preventDefault();
        event.stopPropagation();

        if (isDownPressed) {
          if (this.state.chosenUserIndex + 1 <= this.state.potentialMentionedUsers.length - 1)
            this.setState(oldState => {
              return {
                chosenUserIndex: oldState.chosenUserIndex + 1
              }
            })
        }

        if (isUpPressed) {
          if (this.state.chosenUserIndex - 1 >= 0)
            this.setState(oldState => {
              return {
                chosenUserIndex: oldState.chosenUserIndex - 1
              }
            })
        }

        if (isEscapePressed) {
          this.clearPotentialUsersByPartialName();
        }

        if (isEnterPressed) {
          this.onSelectableUserSelected(this.state.chosenUserIndex)();
        }
      }
    }
  }

  onMouseOverSelectableUser = (index) => event => {
    this.setState({
      chosenUserIndex: index
    })
  }

  onSelectableUserSelected = (index) => event => {
    let chosenUsername = this.state.potentialMentionedUsers[index].username;
    let oldCommentMessage = this.state.commentMessage;
    let oldSelectionEnd = this.state.selectionEnd;

    let newMessage = replaceLastWordAfterLastAtSign(
      oldCommentMessage,
      oldSelectionEnd,
      chosenUsername
    );

    let newSelectionEnd = getPostitionAfterAtSignBeforeLastWord(oldCommentMessage, oldSelectionEnd) + chosenUsername.length;
    this.setState(
      {
        commentMessage: newMessage
      },
      () => {
        this.textFieldRef.current.setSelectionRange(newSelectionEnd, newSelectionEnd);
      }
    )
    this.clearPotentialUsersByPartialName();
    this.textFieldRef.current.focus();
  }

  onKeyDownDialog = (event) => {
    if (event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onCancel();
    }
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
        <DialogTitle id="confirmation-dialog-title">New comment</DialogTitle>
        <DialogContent>
          <div className="position-relative">
            <TextField
              type="text"
              multiline
              rowsMax={10}
              rows={10}
              placeholder="Write new comment here..."
              value={this.state.commentMessage}
              onChange={this.onCommentMessageChange}
              inputProps={{
                style: {
                  width: "500px"
                },
                onKeyDown: this.onKeyDownInput
              }}
              inputRef={this.textFieldRef}
              onClose={this.clearPotentialUsersByPartialName} />
            {this.state.isPotentialMentionedUsersOpen ?
              <AtSignUserChooserWrapper
                top={this.state.topCoordinateAssignUser}
                left={this.state.leftCoordinateAssignUser}
                usersToChooseFrom={this.state.potentialMentionedUsers}
                chosenIndex={this.state.chosenUserIndex}
                onMouseOverSelectableUser={this.onMouseOverSelectableUser}
                onUserSelected={this.onSelectableUserSelected} />
              :
              null}
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

class AtSignUserChooserWrapper extends React.Component {

  state = {
    visible: false
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        visible: true
      })
    }, 0);
  }

  render() {
    let className = this.state.visible ? "opacity-visible" : "opacity-invisible";

    return (
      <AtSignUserChooserWrapperDiv
        top={this.props.top}
        left={this.props.left}
        className={className}
      >
        <div className="flexbox-vertical">
          {this.props.usersToChooseFrom.map((user, index) => {
            let isSelectedUser = this.props.chosenIndex === index;
            return (
              <SelectableUser
                key={user.id}
                isSelected={isSelectedUser}
                isFirstInList={index === 0}
                isLastInList={index === this.props.usersToChooseFrom.length - 1}
                onMouseOver={this.props.onMouseOverSelectableUser(index)}
                onClick={this.props.onUserSelected(index)}>
                <Typography variant="subtitle2" className={isSelectedUser ? "color-white" : ""}>
                  {user.name}-{user.username}
                </Typography>
              </SelectableUser>
            )
          })}
        </div>
      </AtSignUserChooserWrapperDiv>
    )
  }
}
export default CreateCommentDialog;

