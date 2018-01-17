import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../src/withRoot';
import Layout from '../components/layout';
import { inject, observer } from 'mobx-react'
import Grid from 'material-ui/Grid';
import Link from 'next/link';

const styles = theme => ({
  hero: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  linkBox: {
    textAlign: 'center'
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
            <Grid item xs={12} sm={6}>
              <img className={classes.hero} src="/static/images/logo.png" />
            </Grid>
            <Grid item xs={12} className={classes.linkBox}>
              <Link href='/sign-up'>
                <a>Sign up</a>
              </Link>
            </Grid>
            <Grid item xs={12} className={classes.linkBox}>
              <Link href='/provider-sign-up'>
                <a>Sign up for providers</a>
              </Link>
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
