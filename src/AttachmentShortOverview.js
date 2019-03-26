import React, { Component } from 'react'
import { Typography, IconButton } from '@material-ui/core';
import './AttachmentShortOverview.css';

import RemoveIcon from '@material-ui/icons/Remove';

export default class AttachmentShortOverview extends Component {
    render() {
        return (
            <div className="flexbox-horizontal flexbox-align-items-center">
                <Typography
                    variant="body1"
                    className="attachment-name"
                    onClick={this.props.onAttachmentClick}>
                    {this.props.attachmentName}
                </Typography>
                {this.props.showRemoveIcon ?
                    <IconButton
                        color="inherit"
                        className="small-padding-all-over"
                        aria-label="Remove attachment"
                        onClick={this.props.onClickRemoveAttachment}
                    >
                        <RemoveIcon />
                    </IconButton>
                    :
                    null}
            </div>
        )
    }
}
