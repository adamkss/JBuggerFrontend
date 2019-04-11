import React, { PureComponent } from 'react'
import BarChart from './BarChart';
import PieChart from './PieChart/index';
import styled from 'styled-components';
import { Typography, Paper, List, ListItem, ListItemText } from '@material-ui/core';
import axios from 'axios';
import './Statistics.css';
import ProjectSettingsSection from './ProjectSettingsSection';
import AnimatedNumber from 'react-animated-number';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const LabelOpacityController = styled.div`
    opacity: ${props => props.isActive ? "1" : "0.5"};
    transition: opacity 0.2s;
    cursor: pointer;
`;
const data = [
    {
        name: 'Page A', uv: 5
    },
    {
        name: 'Page B', uv: 100
    },
    {
        name: 'Page C', uv: 250
    },
    {
        name: 'Page D', uv: 400
    }
];
export default class Statistics extends PureComponent {

    state = {
        statisticsByLabels: [],
        activeLabelIndex: -1,
        closeTimeStatistics: {
            bugStatistics: []
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8080/statistics/byLabels")
            .then(({ data }) => {
                this.setState({
                    statisticsByLabels: data
                })
            })

        axios.get("http://localhost:8080/bugs/closedStatistics")
            .then(({ data }) => {
                console.log(data)
                this.setState({
                    closeTimeStatistics: data
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
            <div className="flexbox-vertical" style={{
                scroll: "auto"
            }}>
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

                <ProjectSettingsSection sectionName="Close time" verticalContent centered>
                    {this.state.closeTimeStatistics ?
                        <div className="flexbox-vertical">
                            <ClosedTimeStatistics
                                title="Average:"
                                toCloseMinutes={this.state.closeTimeStatistics.averageMinutes}
                                toCloseDays={this.state.closeTimeStatistics.averageDays}
                                toCloseHours={this.state.closeTimeStatistics.averageHours} />
                            <ClosedTimeStatistics
                                title="Total:"
                                toCloseMinutes={this.state.closeTimeStatistics.totalMinutes}
                                toCloseDays={this.state.closeTimeStatistics.totalDays}
                                toCloseHours={this.state.closeTimeStatistics.totalHours} />
                        </div>
                        :
                        null
                    }
                    <ClosedBugsListWithTable bugs={this.state.closeTimeStatistics.bugStatistics} />
                </ProjectSettingsSection>
            </div>
        )
    }
}

const timeUnitsColors = {
    Minutes: "#7b1fa2",
    Hours: "#f57f17",
    Days: "#3d5afe"
}

const ClosedTimeStatisticsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

class ClosedTimeStatistics extends React.PureComponent {

    state = {
        currentUnitOfAverageTime: "Minutes"
    }

    onNumberClicked = () => {
        let newState = null;
        switch (this.state.currentUnitOfAverageTime) {
            case "Minutes":
                newState = "Hours";
                break;
            case "Hours":
                newState = "Days";
                break;
            case "Days":
                newState = "Minutes";
                break;
        }
        this.setState({
            currentUnitOfAverageTime: newState
        });
    }

    render() {
        return (
            <ClosedTimeStatisticsWrapper>
                <section style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    cursor: "pointer"
                }}
                    onClick={this.onNumberClicked}>
                    <Typography style={{
                        fontSize: "30px",
                        fontWeight: 300,
                        marginRight: "20px"
                    }}>
                        {this.props.title}
                    </Typography>
                    <AnimatedNumber component="text" value={this.props[`toClose${this.state.currentUnitOfAverageTime}`]}
                        style={{
                            transition: '1.5s ease-out',
                            fontSize: 76,
                            color: timeUnitsColors[this.state.currentUnitOfAverageTime],
                            transitionProperty:
                                'background-color, color, opacity'
                        }}
                        duration={500}
                        formatValue={n => Math.round(n)} />
                    <Typography style={{
                        fontSize: "30px",
                        fontWeight: 300
                    }}>
                        {this.state.currentUnitOfAverageTime}
                    </Typography>
                </section>
            </ClosedTimeStatisticsWrapper>
        )
    }
}

class ClosedBugsListWithTable extends React.PureComponent {
    render() {
        return (
            <Paper style={{
            }}>
                <LineChart
                    layout="horizontal"
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 20, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 500]} />
                    <YAxis dataKey="name" type="category" domain={[0, 500]} />
                    <Tooltip />
                    <Line dataKey="uv" stroke="#82ca9d" />
                </LineChart>
                <List component="nav">
                    {this.props.bugs.map(bug =>
                        <ListItem key={bug.bugId} button>
                            <ListItemText primary={bug.bugTitle}></ListItemText>
                        </ListItem>
                    )}
                </List>
            </Paper>
        )
    }
}