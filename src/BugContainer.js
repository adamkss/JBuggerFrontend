import React, { Component } from 'react';
import Bug from './Bug'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  bugContainer: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});

class BugContainer extends Component {

  state = {
    isLoading: false,
    bugs: []
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    })

    fetch('http://localhost:8080/bugs')
      .then((response) => response.json())
      .then((data) => this.setState({
        bugs: data,
        isLoading: false
      }))
  }

  render() {
    // alert('container')
    const { classes } = this.props;
    return (
      <div className={classes.bugContainer}>
        <Grid container spacing={16}>
          {this.state.bugs.map(
            (bug, index) =>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} >
                <Bug key={index} bug={bug} />
              </Grid>
          )}
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(BugContainer);
