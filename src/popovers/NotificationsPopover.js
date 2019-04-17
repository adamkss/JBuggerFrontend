import Popover from '@material-ui/core/Popover';
import React, { Component } from 'react'
import '../NotificationsPopover.css';
import { Divider, Typography } from '@material-ui/core';

export default class NotificationsPopover extends Component {
    state = {

    }

    getIconForNotification(isBugRelevant) {
        const isBugRelevantClass = isBugRelevant ? "bug-icon" : "general-icon";
        const title = isBugRelevant ? "Bug related" : "General";
        return <div className={"notification-icon " + isBugRelevantClass} title={title}>
            <span>{isBugRelevant ? "B" : "G"}</span>
        </div>
    }

    render() {
        return (
            <Popover
                open={this.props.open}
                anchorEl={this.props.anchorEl}
                onClose={this.props.onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div className="notifications-popover">
                    <div className="notifications-title">
                        <span>Notifications</span>
                    </div>
                    <Divider />
                    {this.props.notifications.length === 0 ?
                        <div className="no-notifications">
                            <span>No notifications.</span>
                        </div>
                        :
                        null
                    }
                    <div className="notifications__main">
                        {this.props.notifications.map(notification => {
                            const classExtra = notification.relatedToBug ? "related-to-bug" : "";
                            const onClickCallback = notification.relatedToBug ?
                                this.props.getNotificationRelatedToBugClicked(notification.bugId)
                                :
                                () => { };
                            return (
                                <>
                                    <div className={`notification-content ${classExtra}`} onClick={onClickCallback}>
                                        {this.getIconForNotification(notification.relatedToBug)}
                                        <div className="notification-content__general">
                                            <Typography>{notification.text}</Typography>
                                            {notification.relatedToBug ?
                                                <div>
                                                    <span className="notification__bug-id">
                                                        #{notification.bugId}
                                                    </span>
                                                    <span className="notification__bug-title">
                                                        {notification.bugTitle}
                                                    </span>
                                                </div>
                                                :
                                                null}
                                            <span className="notification__created-time">{notification.createdTime}</span>
                                        </div>
                                    </div>
                                    <div className="notification__divider-wrapper">
                                        <Divider />
                                    </div>
                                </>
                            )
                        }
                        )}
                    </div>
                </div>
            </Popover>
        )
    }
}

//handleCreateNewBug