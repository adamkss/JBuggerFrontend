import React, { Component } from 'react'
import { Typography, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Comment from './Comment';

export default class Comments extends Component {
    render() {
        return (
            <div>
                <div className="flexbox-horizontal">
                    <Typography className="flex-grow" variant="subtitle2">Comments</Typography>
                    <IconButton
                        className="small-padding-all-over"
                        onClick={this.props.onNewCommentPress}>
                        <AddIcon />
                    </IconButton>
                </div>
                {this.props.comments.length == 0 ?
                    <div className="flexbox-horizontal flexbox-justify-center">
                        <Typography variant="subtitle2" className="sidebar__detail-info">No comments yet.</Typography>
                    </div>
                    :
                    null
                }
                {this.props.comments.map(comment =>
                    <Comment
                        key={comment.id}
                        commentText={comment.comment}
                        author={comment.author.name}
                        createdDateTime={comment.createdDateTime} />
                )}
            </div>
        )
    }
}
