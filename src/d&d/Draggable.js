import React, { Component } from 'react';

export default class Draggable extends Component {

    state = {
    }

    componentDidMount() {

    }

    onDragStart = (event, transferData) => {
        if(this.props.onDragStart)
            this.props.onDragStart(event,transferData);

        event.dataTransfer.setData("text/plain", transferData);
    }

    onDragEnd = (event) => {
        if(this.props.onDragEnd){
            this.props.onDragEnd();
        }
    }

    render() {
        const {children, transferData, onDragStart, onDragEnd, ...otherProps} = this.props;
        return (
            <div draggable onDragStart={(e) => this.onDragStart(e, transferData)} onDragEnd={(e) => this.onDragEnd(e)} {...otherProps} >
                {children}
            </div>
        );
    }
}
