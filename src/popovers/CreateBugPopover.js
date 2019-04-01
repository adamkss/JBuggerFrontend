import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React, { Component } from 'react'

export default class CreateBugPopover extends Component {
    state = {
        title: "",
        description: ""
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onPressCreateNewBug = () => {
        this.props.handleCreateNewBug({
            title: this.state.title,
            description: this.state.description
        }
        );
    }

    onKeyDownPopover = (event) => {
        if (event.keyCode === 13 && this.state.title != "") {
            this.onPressCreateNewBug();
        }
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
                    horizontal: 'center',
                }}
                onKeyDown={this.onKeyDownPopover}
            >
                <Grid
                    container
                    direction="column"
                >
                    <TextField
                        id="title"
                        className="text-field"
                        label="Title"
                        value={this.state.title}
                        onChange={this.handleChange('title')}
                        error={this.state.title == ""}
                        autoFocus
                    />
                    <TextField
                        id="description"
                        className="text-field"
                        label="Description"
                        value={this.state.description}
                        onChange={this.handleChange('description')}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onPressCreateNewBug}
                        style={{
                            marginTop: "6px"
                        }}
                        disabled={this.state.title == ""}>
                        Create
                     </Button>
                </Grid>
            </Popover>
        )
    }
}

//handleCreateNewBug
