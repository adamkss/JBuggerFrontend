import React from 'react';
import { Typography } from '@material-ui/core';
import './BugDetailsSidebarSection.css';

class BugDetailsSidebarSection extends React.PureComponent {
    state = {
    }

    componentDidMount() {

    }

    onEditClick = () => {
        if (this.props.onEditClick)
            this.props.onEditClick();
        
    }

    onCancelEdit = () => {
        this.endEditMode();
    }

    onSave = () => {
        this.endEditMode();
        if (this.props.onSave) {
            this.props.onSave();
        }
    }

    endEditMode = () => {
       this.props.onEndEditMode();
    }

    render() {
        return (
            <section>
                <div className="flexbox-horizontal">
                    <Typography className="flex-grow" variant="subtitle2">{this.props.sectionName}</Typography>
                    
                    {this.props.isInEditMode ?
                        <React.Fragment>
                            {
                                this.props.doneInsteadOfSaveAndCancel ?
                                    <Typography className="sidebar__edit-button slight-padding-right" variant="subtitle2" onClick={this.onCancelEdit}>Done</Typography>
                                    :
                                    <>
                                        <Typography className="sidebar__edit-button slight-padding-right" variant="subtitle2" onClick={this.onSave}>Save</Typography>
                                        <Typography className="sidebar__edit-button" variant="subtitle2" onClick={this.onCancelEdit}>Cancel</Typography>
                                    </>
                            }
                        </React.Fragment>
                        :
                        <Typography className="sidebar__edit-button" variant="subtitle2" onClick={this.onEditClick}>Edit</Typography>
                    }
                </div>
                {this.props.isInEditMode ?
                    this.props.renderEditControl()
                    :
                    this.props.renderViewControl ?
                        this.props.renderViewControl()
                        :
                        <Typography className="sidebar__detail-info white-space-pre">
                            {this.props.initialData}
                        </Typography>

                }
            </section>
        )
    }
}

export default BugDetailsSidebarSection;