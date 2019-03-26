import React from 'react';

export default class UnmountingDelayed extends React.PureComponent {

    state = {
        shouldRender: this.props.show
    }

    componentDidUpdate(prevProps) {
        if (prevProps.show && !this.props.show) {
            setTimeout(() => {
                this.setState({
                    shouldRender: false
                })
            }, this.props.delay)
        }
        if (!prevProps.show && this.props.show) {
            this.setState({
                shouldRender: true
            })
        }
    }

    render() {
        return (
            this.state.shouldRender ? this.props.children : null
        )
    }
}