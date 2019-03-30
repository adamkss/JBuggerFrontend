import React, { Component } from 'react'
import { Typography } from '@material-ui/core';

export default class History extends Component {
    render() {
        return (
            <div style={{ marginBottom: "10px" }}>
                <div className="flexbox-horizontal">
                    <Typography className="flex-grow" variant="subtitle2">
                        History
                    </Typography>
                </div>
                {this.props.changes.length == 0 ?
                    <div className="flexbox-horizontal flexbox-justify-center">
                        <Typography variant="subtitle2" className="sidebar__detail-info">
                            No changes yet.
                        </Typography>
                    </div>
                    :
                    null
                }
                {this.props.changes.map(change =>
                    <div className="comment-shell">
                        <header className="flexbox-horizontal">
                            <Typography className="flex-grow sidebar__detail-info">
                                {change.changeAuthor.name}
                            </Typography>
                            <Typography className="sidebar__detail-info">
                                {change.timeOfChangeHappening}
                            </Typography>
                        </header>
                        <Typography className="white-space-pre">
                            {change.changeText}
                        </Typography>
                        {change.fieldRelatedChange ?
                            <div className="flexbox-horizontal">
                                <Typography variant="subtitle2" style={
                                    {
                                        marginRight: "5px"
                                    }}>
                                    {change.fieldChanged}:
                                </Typography>
                                <Typography variant="subtitle2" style={
                                    {
                                        color: "red",
                                        marginRight: "5px"
                                    }
                                }>
                                    {change.oldValue}
                                </Typography>
                                <Typography variant="subtitle2" style={
                                    {
                                        marginRight: "5px"
                                    }}>
                                    ->
                                </Typography>
                                <Typography variant="subtitle2" style={
                                    {
                                        color: "green"
                                    }
                                }>
                                    {change.newValue}
                                </Typography>

                            </div>
                            :
                            null}
                    </div>
                )}
            </div>
        )
    }
}
