import React from 'react';
import colors from './constants/colors';
import styled from 'styled-components';

const SelectableColorCircle = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 40px;
    background-color: ${props => props.color};
    ${props => props.selected ? "border: 2px solid black" : ""}
    cursor: pointer;
    margin-left: 3px;
`;

export default class ColorSelecter extends React.PureComponent {

    onColorSelect = (color) => () => {
        this.props.onChange({
            target: {
                value: color
            }
        });
    }

    render() {
        return (
            <div className="flexbox-horizontal with-margin-top">
                {colors.map(color =>
                    <SelectableColorCircle
                        color={color}
                        key={color}
                        selected={this.props.selectedColor === color}
                        onClick={this.onColorSelect(color)} />
                )}
            </div>
        )
    }
}