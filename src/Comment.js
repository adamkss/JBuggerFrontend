import React, { Component } from 'react'
import { Typography } from '@material-ui/core';
import './Comment.css';

export default class Comment extends Component {
    render() {
        return (
            <div className="comment-shell">
                <header className="flexbox-horizontal">
                    <Typography className="flex-grow sidebar__detail-info">{this.props.author}</Typography>
                    <Typography className="sidebar__detail-info">{this.props.createdDateTime.replace("T", " ")}</Typography>
                </header>
                {/* <Typography className="white-space-pre">
                    {this.props.commentText}
                </Typography> */}
                <div className="comment-parts">
                    {this.props.commentTextParts.map(commentPart => {
                        if (!commentPart.userRelevant) {
                            return <span key={commentPart.id}>{commentPart.content}</span>
                        }
                        else {
                            return <span className="user-mention" key={commentPart.id}>{commentPart.content}</span>
                        }
                    })}
                </div>
            </div>
        )
    }
}