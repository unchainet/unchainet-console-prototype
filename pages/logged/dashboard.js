import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import withRoot from '../../src/withRoot';
import Layout from '../../components/layout';
import {inject, observer} from 'mobx-react'
import DashboardComp from '../../components/dashboard';

const styles = theme => ({});

@inject('store') @observer
class Dashboard extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div>
        <Layout>
          <DashboardComp/>
        </Layout>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Dashboard));
