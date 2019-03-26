import React from 'react';
import { Button, TextField } from '@material-ui/core';
import ColorSelecter from './ColorSelecter';
import './CreateSwimLaneModalContent.css';

export default class CreateSwimLaneModalContent extends React.PureComponent {
    state = {
        swimLaneName: "",
        swimLaneColor: null
    }

    handleStateChange = (propertyName) => (event) => {
        this.setState({
            [propertyName]: event.target.value
        })
    }

    onNewSwimLaneClick = () => {
        if (this.props.onNewSwimLaneDone)
            this.props.onNewSwimLaneDone(this.state);
    }

    render() {
        return (
            <div className="flexbox-vertical-centered">
                <TextField
                    id="swimLaneName"
                    label="New Swim Lane Name"
                    placeholder="Swim lane name"
                    value={this.state.swimLaneName}
                    onChange={this.handleStateChange('swimLaneName')}
                    autoFocus
                />
                <ColorSelecter 
                    onChange={this.handleStateChange('swimLaneColor')}
                    selectedColor={this.state.swimLaneColor}/>
                <Button
                    fullWidth
                    className="with-margin-top"
                    variant="contained"
                    color="primary"
                    onClick={this.onNewSwimLaneClick}
                    disabled={this.state.swimLaneName.length === 0}>
                    Done
            </Button>
            </div>

        )
    }
}