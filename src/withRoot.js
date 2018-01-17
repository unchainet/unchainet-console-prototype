import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import { Provider } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import { initStore } from '../stores/store';
import getPageContext from './getPageContext';

const styles = theme => ({
  "@global": {
    html: {
      fontFamily: theme.typography.fontFamily
    },
    a: {
      color: '#222'
    }
  }
});

function withRoot(Component) {
  class WithRoot extends React.Component {
    static getInitialProps ({ req }) {
      const isServer = !!req;
      const store = initStore(isServer);
      return { initialState: getSnapshot(store), isServer }
    }

    constructor (props) {
      super(props);
      this.store = initStore(props.isServer, props.initialState)
    }

    componentWillMount() {
      this.pageContext = this.props.pageContext || getPageContext();
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    pageContext = null;

    render() {
      // MuiThemeProvider makes the theme available down the React tree thanks to React context.
      return (
        <Provider store={this.store}>
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
            <Reboot />
            <Component {...this.props} />
          </MuiThemeProvider>
        </Provider>
      );
    }
  }

  WithRoot.propTypes = {
    pageContext: PropTypes.object,
  };

  /*
  WithRoot.getInitialProps = ctx => {
    if (Component.getInitialProps) {
      return Component.getInitialProps(ctx);
    }

    return {};
  };
*/
  return withStyles(styles)(WithRoot);
}

export default withRoot;
