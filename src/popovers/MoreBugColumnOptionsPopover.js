import Popover from '@material-ui/core/Popover';
import React, { Component } from 'react'
import {MenuList, MenuItem} from '@material-ui/core';

export default class MoreBugColumnOptionsPopover extends Component {
    state = {

    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onDeleteClick = () => {
        this.props.onDeleteSwimlaneIntention();
    }

    render() {
        return (
            <Popover
                id={this.props.id}
                open={this.props.open}
                anchorEl={this.props.anchorEl}
                onClose={this.props.onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuList>
                    <MenuItem onClick={this.onDeleteClick}>Delete swimlane...</MenuItem>
                    <MenuItem onClick={this.props.onRenameSwimlaneIntention}>Change name</MenuItem>
                    <MenuItem onClick={this.props.onRecolorSwimlaneIntention}>Change color</MenuItem>
                </MenuList>
            </Popover>
        )
    }
}

//handleCreateNewBug
