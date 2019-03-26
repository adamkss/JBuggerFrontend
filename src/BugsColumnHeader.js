import React, { Component } from 'react';
import './BugsColumnHeader.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Divider, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import 'typeface-roboto';
import styled from 'styled-components';

const ColoredHeaderLine = styled.div`
  width: 340px;
  height: 3px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: ${props => props.color}
`;



class BugsColumnHeader extends Component {

  constructor(props) {
    super(props);
  }

  state = {

  }

  componentDidMount() {

  }

  render() {
    const { classes, provided } = this.props;
    return (
      <div
        className="header-parent" {...provided.dragHandleProps} >
        <Grid
          container
          direction="row"
          className="headerGrid"
          alignItems="center">
          <Grid item>
            <ColoredHeaderLine color={this.props.statusColor} />
          </Grid>
          <Grid item className="flex-grow left-subtitle">
            <Typography variant="subtitle2" color="inherit" >
              {this.props.status}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              color="inherit"
              aria-label="Add bug"
              onClick={this.props.onAddBug}
            >
              <AddIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              className="small-custom-padding-left-right"
              color="inherit"
              aria-label="Other"
              onClick={this.props.onMoreOptions}
            >
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
      </div>
    );
  }
}

//predefinedStatusNames
//onAddBug
//headerColorClass
export default BugsColumnHeader;
