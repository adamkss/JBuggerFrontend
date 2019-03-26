import React, { Component } from 'react';

export default class Droppable extends Component {

    state = {
    }

    componentDidMount() {

    }

    onDragOver = (event) => {
        if (this.props.onDragOver) {
            this.props.onDragOver(event);
        }
        event.preventDefault();
    }

    onDragLeave = (event) => {
        if(this.props.onDragLeave){
            this.props.onDragLeave();
        }
    }

    onDrop = (event, category) => {
        if(this.props.onDrop)
            this.props.onDrop(event.dataTransfer.getData("text"));
    }

    render() {
        const {children, onDragOver, onDragLeave, onDrop, ...otherProps} = this.props;
        return (
            <div droppable onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop} {...otherProps}>
                {children}
            </div>
        );
    }
}
