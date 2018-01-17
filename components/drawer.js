import {withStyles} from 'material-ui/styles';
import React from "react";
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import {ListItem, ListItemIcon, ListItemText} from "material-ui/List";
import ExitToApp from 'material-ui-icons/ExitToApp';
import Dashboard from 'material-ui-icons/Dashboard';
import PropTypes from 'prop-types';
import {inject,observer} from "mobx-react";
import Router from 'next/router';

const styles = theme => ({
  list: {
    width: 250,
  },
});

@inject('store') @observer
class DrawerComp extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
  };

  state = {
    open: false
  };

  static defaultProps = {
    open: false
  };


  render() {
    const {classes,open,onClose,store} = this.props;

    return (
      <Drawer open={open} onClose={()=>onClose()}>
        <div
          tabIndex={0}
          role="button"
          onClick={()=>onClose()}
          onKeyDown={()=>onClose()}
        >
          <div className={classes.list}>
            <List>
              <ListItem button onClick={()=>Router.push("/index")}>
                <ListItemIcon>
                  <Dashboard/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
              </ListItem>
              <ListItem button onClick={()=>store.logout()}>
                <ListItemIcon>
                  <ExitToApp/>
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </div>
        </div>
      </Drawer>
    )
  }
}

export default withStyles(styles)(DrawerComp);