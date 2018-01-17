import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../src/withRoot';
import Layout from '../components/layout';
import { inject, observer } from 'mobx-react'
import Grid from 'material-ui/Grid';
import Link from 'next/link';
import Typography from "material-ui/Typography";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import FormControl from "material-ui/Form/FormControl";

const styles = theme => ({
  line: {
    textAlign: 'center'
  },
  box: {
    padding: 20,
    margin: 10
  },
  textField: {
    margin: '10px 0 10px 0'
  }
});

@inject('store') @observer
class Index extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Layout>
          <Grid container justify="center">
            <Grid item xs={12} sm={6} md={4}>
              <Paper className={classes.box} elevation={4}>
                <Typography type="headline" component="h3" className={classes.line}>
                  Sign up
                </Typography>

                <TextField label="First Name" required fullWidth className={classes.textField} />
                <TextField label="Last Name" required fullWidth className={classes.textField} />
                <TextField label="E-mail" required fullWidth className={classes.textField} />
                <TextField label="Password" required fullWidth className={classes.textField} type="password" />
                <TextField label="Confirm Password" required fullWidth className={classes.textField} type='password' />

                <Button raised color='primary'>Submit</Button>
              </Paper>
            </Grid>
          </Grid>
        </Layout>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
