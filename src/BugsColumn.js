import React, { PureComponent } from 'react';
import './BugsColumn.css';
import StringFormatters from './utils/StringFormatters';
import BugShortOverview from './BugShortOverview'
import BugsColumnHeader from './BugsColumnHeader';
import Draggable from './d&d/Draggable';
import Droppable from './d&d/Droppable';
import { moveBug } from './redux-stuff/actions/actionCreators';

import { connect } from 'react-redux';
import InfoMessage from './InfoMessage';

class BugsColumn extends PureComponent {

  state = {
    bugDragHoverOver: false
  }

  componentDidMount() {

  }

  onDrop = (bugInfo) => {
    this.props.onBugDrop();
    const [bugId, oldStatus] = bugInfo.split("-");
    this.props.dispatch(moveBug(bugId, oldStatus, this.props.bugStatus));
    this.setState({
      bugDragHoverOver: false
    })
  }

  onBugDragStart = () => {
    if (this.props.bugDragStarted)
      this.props.bugDragStarted(this.props.bugStatus);
  }

  onDragOver = () => {
    this.setState({
      bugDragHoverOver: true
    })
  }

  onDragLeave = () => {
    this.setState({
      bugDragHoverOver: false
    })
  }

  onDragEnd = () => {
    this.props.onBugDrop();
  }

  render() {
    let extraStyle = this.props.isPossibleDropTarget && !this.state.bugDragHoverOver ? " possible-drop-target" : "";
    extraStyle = this.props.isPossibleDropTarget && this.state.bugDragHoverOver ? " possible-drop-target-hover-over" : extraStyle;
    const { provided, innerRef } = this.props;
    return (
      <div className={"bugs-column" + extraStyle} ref={innerRef} {...provided.draggableProps}>
        <div className="flexbox-vertical-centered full-height full-width">
          <BugsColumnHeader
            provided={provided}
            status={StringFormatters.ToNiceBugStatus(this.props.bugStatus)}
            statusColor={this.props.statusColor}
            onAddBug={this.props.onAddBug}
            onMoreOptions={this.props.onMoreOptions} />
          <Droppable onDrop={this.onDrop} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave}
            className={"flexbox-vertical-centered vertical-scroll-container left-right-padded-container full-width full-height border-radius-bottom"}>
            {this.props.bugs.length != 0 ?
              this.props.bugs.map(
                (bug) =>
                  <Draggable
                    key={bug.id}
                    transferData={bug.id + "-" + this.props.bugStatus}
                    onDragStart={this.onBugDragStart}
                    onDragEnd={this.onDragEnd}>
                    <BugShortOverview 
                      title={bug.title} 
                      id={bug.id} 
                      labels={bug.labels} 
                      severity={bug.severity} />
                  </Draggable>
              )
              :
              <InfoMessage message="No bugs here." />
            }
          </Droppable>
        </div>
      </div>
    );
  }
}

//bugStatus
//bugs
//headerColorClass
//onAddBug
export default connect()(BugsColumn);
