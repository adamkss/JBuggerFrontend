import React, { PureComponent } from 'react'
import PieChart from './PieChart/index';
import styled from 'styled-components';
import { Typography, Paper, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import axios from 'axios';
import './Statistics.css';
import ProjectSettingsSection from './ProjectSettingsSection';
import AnimatedNumber from 'react-animated-number';
import { BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { connect } from 'react-redux';
import LabelShort from './LabelShort';
import { getIconForSeverity } from './BugShortOverview';

import DateRangePicker from '@wojtekmaj/react-daterange-picker';

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
class Statistics extends PureComponent {

    state = {
        statisticsByLabels: [],
        activeLabelIndex: -1,
        closeTimeStatistics: {
            bugStatistics: []
        },
        userStatistics: {
            createdMostBugs: [],
            solvedLeastBugs: [],
            solvedMostBugs: []
        },
        activeBugsStatisticsDateRange: [new Date(), new Date()],
        activeBugsStatistics: [],
        minMaxBugsStatistics: null
    }

    _loadStatistics = () => {
        axios.get(`http://localhost:8080/statistics/byLabels/${this.props.currentProjectId}`)
            .then(({ data }) => {
                this.setState({
                    statisticsByLabels: data
                })
            })

        axios.get(`http://localhost:8080/bugs/closedStatistics/${this.props.currentProjectId}`)
            .then(({ data }) => {
                this.setState({
                    closeTimeStatistics: data
                })
            })

        axios.get(`http://localhost:8080/statistics/byUsers/${this.props.currentProjectId}`)
            .then(({ data }) => {
                this.setState({
                    userStatistics: {
                        createdMostBugs: data.createdMostBugs.slice(0, 3).map(data => ({
                            name: data.username,
                            bugs: data.number
                        })),
                        solvedLeastBugs: data.solvedLeastBugs.slice(0, 3).map(data => ({
                            name: data.username,
                            bugs: data.number
                        })),
                        solvedMostBugs: data.solvedMostBugs.slice(0, 3).map(data => ({
                            name: data.username,
                            bugs: data.number
                        }))
                    }
                })
            })
        axios.get(`http://localhost:8080/statistics/minMaxBugs`)
            .then(({ data }) => {
                this.setState({
                    minMaxBugsStatistics: data
                })
            })
    }

    _getActiveBugsStatistics = (startDate, endDate) => {
        axios.get(`http://localhost:8080/statistics/activeBugs/${this.props.currentProjectId}/${startDate}/${endDate}`)
            .then(({ data }) => {
                this.setState({
                    activeBugsStatistics: data
                })
            })
    }

    componentDidMount() {
        this._loadStatistics();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentProjectId !== this.props.currentProjectId) {
            this._loadStatistics();
        }
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

    onActiveBugsStatisticsIntervalChange = (newInterval) => {
        const yearStart = newInterval[0].getFullYear();
        const dayStart = newInterval[0].getDate();
        const monthStart = newInterval[0].getMonth() + 1;

        const yearEnd = newInterval[1].getFullYear();
        const dayEnd = newInterval[1].getDate();
        const monthEnd = newInterval[1].getMonth() + 1;

        const year = newInterval.getFullYear
        this.setState({
            activeBugsStatisticsDateRange: newInterval
        })
        this._getActiveBugsStatistics(
            yearStart + "-" + monthStart + "-" + dayStart,
            yearEnd + "-" + monthEnd + "-" + dayEnd
        )
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
                    {this.state.closeTimeStatistics.bugStatistics.length > 0 ?
                        <ClosedBugsListWithTable
                            bugs={this.state.closeTimeStatistics.bugStatistics}
                            statuses={this.props.statuses} />
                        :
                        null}
                </ProjectSettingsSection>
                <ProjectSettingsSection sectionName="User statistics">
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        paddingTop: '10px'
                    }}>
                        <UserStatistics
                            title="Top 3 users who introduced most bugs."
                            data={this.state.userStatistics.createdMostBugs}
                            barColor="#512DA8" />
                        <UserStatistics
                            title="Top 3 users who solved most bugs."
                            data={this.state.userStatistics.solvedMostBugs}
                            barColor="#303F9F" />
                        <UserStatistics
                            title="Top 3 users who solved least bugs."
                            data={this.state.userStatistics.solvedLeastBugs}
                            barColor="#455A64" />
                    </div>
                </ProjectSettingsSection>
                <ProjectSettingsSection sectionName="Active bugs statistics" verticalContent>
                    <DateRangePicker
                        onChange={this.onActiveBugsStatisticsIntervalChange}
                        value={this.state.activeBugsStatisticsDateRange}
                    />
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        paddingTop: '10px'
                    }}>
                        <ActiveBugsStatistics
                            data={this.state.activeBugsStatistics} />
                    </div>
                </ProjectSettingsSection>
                {this.state.minMaxBugsStatistics ?
                    <ProjectSettingsSection sectionName="Min/max projects" verticalContent>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            paddingTop: '10px'
                        }}>
                            <Typography>Minimum project: {this.state.minMaxBugsStatistics.minProjectName} - {this.state.minMaxBugsStatistics.minProjectBugsNr} bugs</Typography>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            paddingTop: '10px'
                        }}>
                            <Typography>Maximum project: {this.state.minMaxBugsStatistics.maxProjectName} - {this.state.minMaxBugsStatistics.maxProjectNr} bugs</Typography>
                        </div>
                    </ProjectSettingsSection>
                    :
                    null}
            </div >
        )
    }
}

export default connect(state => ({
    statuses: state.bugs.statuses,
    currentProjectId: state.bugs.currentProjectId
}))(Statistics);

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
                    {this.props.afterTitle ?
                        <Typography style={{
                            fontSize: "30px",
                            fontWeight: 300,
                            paddingLeft: "10px"
                        }}>
                            {this.props.afterTitle}
                        </Typography>
                        :
                        null}
                </section>
            </ClosedTimeStatisticsWrapper>
        )
    }
}

class ClosedBugsListWithTable extends React.PureComponent {
    state = {
        statusChangesOfBug: [],
        selectedBugId: null,
        selectedBugClosedIn: {
            minutes: 0,
            hours: 0,
            days: 0
        },
        selectedBugAuthor: null
    }

    componentDidMount() {
        this.getOnBugClickHandler(this.props.bugs[0])();
    }

    getOnBugClickHandler = bug => event => {
        axios.get(`http://localhost:8080/bugs/bug/${bug.bugId}/history/statuses`)
            .then(({ data }) => {
                this.setState({
                    statusChangesOfBug: data,
                    selectedBugId: bug.bugId,
                    selectedBugClosedIn: {
                        minutes: bug.durationMinutes,
                        hours: bug.durationHours,
                        days: bug.durationDays
                    },
                    selectedBugAuthor: bug.closedByUserName
                })
            })
    }

    getStatusColorForStatus = (statusName) => {
        const status = this.props.statuses.filter(status => status.statusName === statusName);
        return status[0].statusColor;
    }
    render() {
        const cronologicallyOrderedChanges = this.state.statusChangesOfBug.reverse();
        return (
            <Paper style={{
                minWidth: "60vw"
            }}>
                {this.state.statusChangesOfBug.length > 0 ?
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "baseline",
                        padding: "5px"

                    }}>
                        <MountingDelay timeout={0} key={Math.random()}>
                            <div className="status-state">
                                <span style={{
                                    color: this.getStatusColorForStatus(cronologicallyOrderedChanges[0].oldValue)
                                }}>{cronologicallyOrderedChanges[0].oldValue}</span>
                            </div>
                        </MountingDelay>
                        {cronologicallyOrderedChanges.map((statusChange, index) =>
                            <MountingDelay timeout={(index + 1) * 100} key={Math.random()}>
                                <div className="status-state">
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "10px",
                                        marginLeft: "10px"
                                    }}>
                                        <ArrowForward />
                                        <Typography style={{
                                            fontWeight: "300",
                                            opacity: 0.6
                                        }}>
                                            {statusChange.timeOfChangeHappening.split(' ')[0]}
                                        </Typography>
                                        <Typography style={{
                                            fontWeight: "300",
                                            opacity: 0.6
                                        }}>
                                            {statusChange.timeOfChangeHappening.split(' ')[1]}
                                        </Typography>
                                    </div>
                                    <span style={{
                                        color: this.getStatusColorForStatus(statusChange.newValue)
                                    }}>{statusChange.newValue}</span>
                                </div>
                            </MountingDelay>
                        )}
                    </div>
                    :
                    null}
                <Divider />
                {this.state.selectedBugId ?
                    <ClosedTimeStatistics
                        title="Closed in:"
                        afterTitle={` by ${this.state.selectedBugAuthor}`}
                        toCloseMinutes={this.state.selectedBugClosedIn.minutes}
                        toCloseDays={this.state.selectedBugClosedIn.days}
                        toCloseHours={this.state.selectedBugClosedIn.hours} />
                    :
                    null}
                <List component="nav">
                    {this.props.bugs.map(bug =>
                        <ListItem
                            selected={bug.bugId === this.state.selectedBugId}
                            key={bug.bugId}
                            button
                            onClick={this.getOnBugClickHandler(bug)}>
                            {getIconForSeverity(bug.severity)}
                            <ListItemText
                                primary={`#${bug.bugId} ${bug.bugTitle}`}
                                secondary={`Closed by: ${bug.closedByUserName} at ${bug.closedDateTime}`}>
                            </ListItemText>
                            <div className="flexbox-horizontal flex-wrap">
                                {bug.labels.map(label =>
                                    <LabelShort
                                        key={label.labelName}
                                        text={label.labelName}
                                        backgroundColor={label.backgroundColor}
                                        smallMarginBottom />)}
                            </div>
                        </ListItem>
                    )}
                </List>
            </Paper>
        )
    }
}

class MountingDelay extends React.PureComponent {
    state = {
        isVisible: false
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isVisible: true
            })
        }, this.props.timeout);
    }
    render() {
        const style = {
            transition: "opacity 0.7s",
            opacity: this.state.isVisible ? "1" : "0"
        }
        return <div style={style}>
            {this.props.children}
        </div>
    }
}

class UserStatistics extends React.PureComponent {
    componentDidMount() {

    }
    render() {
        return (
            <div style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }>
                <BarChart
                    width={350}
                    height={300}
                    data={this.props.data}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Bugs" dataKey="bugs" fill={this.props.barColor} />
                </BarChart>
                <Typography>{this.props.title}</Typography>
            </div>
        )
    }
}

class ActiveBugsStatistics extends React.PureComponent {
    componentDidMount() {

    }
    render() {
        return (
            <div style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }>
                <LineChart
                    width={800}
                    height={300}
                    data={this.props.data}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis axisLine={true} dataKey="date" angle={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dot={false} type="monotone" name="Bugs" dataKey="numberOfActiveBugs" stroke="#8884d8" />
                </LineChart>
                <Typography>{this.props.title}</Typography>
            </div>
        )
    }
}