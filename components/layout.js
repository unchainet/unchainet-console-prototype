import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui/Button';
import Router from 'next/router';
import React from "react";
import {inject, observer} from "mobx-react/index";
import Drawer from './drawer';

const styles = theme => ({
  root: {
    width: '100%'
  },
  link: {
    paddingLeft: 20,
    paddingRight: 20
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  mainContent: {
    padding: theme.spacing.unit * 2
  }
});

@inject('store') @observer
class Index extends React.Component {
  state = {
    drawerOpen: false
  }

  render() {
    const {classes,store,children } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {store.isLogged &&
            <IconButton className={classes.menuButton} aria-label="Menu" onClick={()=>this.setState({drawerOpen:true})}>
              <MenuIcon color='contrast'/>
            </IconButton>}
            <Typography type="title" color="inherit" className={classes.flex}>
              UNCHAINET
            </Typography>
            {store.isLogged ?
              <Button color="contrast" onClick={() => store.logout()}>Logout</Button>
              :
              <Button color="contrast" onClick={() => Router.push('/login')}>Login</Button>
            }
            <Button color="contrast" onClick={() => Router.push('/sign-up')}>Sign up</Button>
          </Toolbar>
        </AppBar>
        <div className={classes.mainContent}>{children}</div>
        <Drawer open={this.state.drawerOpen} onClose={()=>this.setState({drawerOpen:false})}  />
      </div>
    )
  }
}

export default withStyles(styles)(Index);