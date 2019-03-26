import React from 'react';
import styled from 'styled-components';

const ParentDiv = styled.div`
    height: 20px;
    border-radius: 7px;
    background-color: ${props => {
        if (props.selectable && !props.selected) {
            return "grey";
        }
        return props.backgroundColor || "orange";
    }};
    color: ${props => {
        if (props.selectable && !props.selected)
            return "#FFFFFF";

        if (props.backgroundColor) {
            const red = parseInt(props.backgroundColor.substring(1, 2), 16);
            const green = parseInt(props.backgroundColor.substring(3, 2), 16);
            const blue = parseInt(props.backgroundColor.substring(5, 2), 16);
            if ((red * 0.299 + green * 0.587 + blue * 0.114) >= 186)
                return "#000000";
        }

        return "#FFFFFF";
    }}
    opacity: ${props => {
        if (props.selectable && !props.selected)
            return "0.5";
        return "1";
    }}
    font-size: 0.78rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 500;
    line-height: 1.57;
    letter-spacing: 0.00714em;  
    padding-left: 3px;
    padding-right: 3px;
    padding-top: 1px;
    padding-bottom: 1px;
    margin-left: 3px;
    cursor: ${props => props.selectable ? "pointer" : "initial"};
    ${props => props.smallMarginBottom ? "margin-bottom: 6px" : null}
`;


export default class LabelShort extends React.PureComponent {

    render() {
        const { text, ...restProps } = this.props;
        return (
            <ParentDiv {...restProps}>
                {text}
            </ParentDiv>
        )
    }
}