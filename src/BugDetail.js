import React, { Component } from 'react';
import './Bug.css';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import 'typeface-roboto';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  container: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});

class BugDetail extends Component {

  state = {
    bug: {}
  }

  componentDidMount() {
    let sBugId = this.props.match.params.bugId;

    fetch(`http://localhost:8080/bugs/bug/${sBugId}`)
      .then((response) => response.json())
      .then((data) => this.setState((oldState) => ({
        bug: data
      })))
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid
        container
        direction="column"
        spacing={16}
        className={classes.container}
      >
        <Grid item>
          <Typography variant="h6" gutterBottom>
            {this.state.bug.title}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" gutterBottom>
            {this.state.bug.description}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" gutterBottom>
            {this.state.bug.description}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withRouter(BugDetail));
