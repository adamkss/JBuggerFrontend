import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import React, { Component } from 'react'

export default class CreateBugPopover extends Component {
    state = {
        title: "",
        description: "",
        severity: ""
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onPressCreateNewBug = () => {
        this.props.handleCreateNewBug(this.state);
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
                    />
                    <TextField
                        id="description"
                        className="text-field"
                        label="Description"
                        value={this.state.description}
                        onChange={this.handleChange('description')}
                    />
                    <TextField
                        id="date"
                        className="text-field"
                        label="Target date"
                        type="date"
                        defaultValue="2019-01-01"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormControl className="text-field">
                        <InputLabel htmlFor="severity">Severity</InputLabel>
                        <Select
                            value={this.state.severity}
                            onChange={this.handleChange('severity')}
                            inputProps={{
                                name: 'severity',
                                id: 'severity',
                            }}
                        >
                            <MenuItem value={"LOW"}>Low</MenuItem>
                            <MenuItem value={"MEDIUM"}>Medium</MenuItem>
                            <MenuItem value={"HIGH"}>High</MenuItem>
                            <MenuItem value={"CRITICAL"}>Critical</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onPressCreateNewBug}>
                        Create
                     </Button>
                </Grid>
            </Popover>
        )
    }
}

//handleCreateNewBug
