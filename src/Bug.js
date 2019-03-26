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
  paper: {
  },
});

class Bug extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper elevation={3} className={classes.paper}>
        <Grid container direction="column" >
          <Grid item>
            <Typography variant="h4" gutterBottom>
              {this.props.bug.title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" gutterBottom>
              {this.props.bug.description}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => { this.props.history.push(`/bugs/bug/${this.props.bug.id}`); }}
            >Details</Button>
          </Grid>
        </Grid>
      </Paper >
    );
  }
}

export default withStyles(styles)(withRouter(Bug));
