import React, { PureComponent } from 'react'
import BarChart from './BarChart';
import PieChart from './PieChart/index';
import styled from 'styled-components';
import {Typography} from '@material-ui/core';

import './Statistics.css';

import ProjectSettingsSection from './ProjectSettingsSection';

const LabelOpacityController = styled.div`
    opacity: ${props => props.isActive ? "1" : "0.5"};
    transition: opacity 0.2s;
    cursor: pointer;
`;

export default class Statistics extends PureComponent {

    state = {
        statisticsByLabels: [],
        activeLabelIndex: -1
    }

    componentDidMount() {
        fetch("http://localhost:8080/statistics/byLabels")
            .then((response) => response.json())
            .then(data => {
                this.setState({
                    statisticsByLabels: data
                })
            })
    }

    onMouseOverLabelName = (labelName, labelIndex) => event => {
        this.setState({
            activeLabelIndex: labelIndex
        })
    }

    onMouseLeaveLabel = () => {
        this.setState({
            activeLabelIndex: null
        })
    }

    render() {
        return (
            <div className="flexbox-vertical">
                <ProjectSettingsSection sectionName="By labels" horizontalContent>
                    {this.state.statisticsByLabels.length > 0 ?
                        <>
                            <section className="pie-chart">
                                <PieChart
                                    data={this.state.statisticsByLabels}
                                    transitionDuration="0.2s"
                                    expandOnHover
                                    expandSize={2}
                                    expandedIndex={this.state.activeLabelIndex}
                                    controlledFromExterior={this.state.statisticsByLabels !== null}
                                    onSectorHover={(d, i, e) => {
                                        if (d) {
                                            this.setState({
                                                activeLabelIndex: i
                                            })
                                        } else {
                                            this.setState({
                                                activeLabelIndex: null
                                            })
                                        }
                                    }} />
                            </section>
                            <section className="flexbox-vertical flexbox-justify-center with-big-margin-left">
                                {this.state.statisticsByLabels.map((element, index) => {
                                    return (
                                        <LabelOpacityController isActive={this.state.activeLabelIndex === index} key={element.title}>
                                            <div className="flexbox-horizontal small-margin-bottom"
                                                onMouseOver={this.onMouseOverLabelName(element.title, index)}
                                                onMouseLeave={this.onMouseLeaveLabel}>
                                                <div className="color-indicator" style={{ backgroundColor: element.color }} />
                                                <div className="with-margin-left">
                                                    <span>
                                                        {`${element.title}: ${element.value}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </LabelOpacityController>
                                    )
                                })}
                            </section>
                        </>
                        :
                        <Typography variant="subtitle2" className="sidebar__detail-info">No bugs with labels existing.</Typography>
                    }

                </ProjectSettingsSection>

            </div>

        )
    }
}
