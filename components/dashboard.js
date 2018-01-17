// @flow weak
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import React from "react";
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import {inject, observer} from "mobx-react/index";
import IconButton from "material-ui/IconButton";
import DeleteIcon from 'material-ui-icons/Delete';
import PauseIcon from 'material-ui-icons/Pause';
import EditIcon from 'material-ui-icons/Edit';
import Tooltip from "material-ui/Tooltip";
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Router from 'next/router';

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 4,
    position: 'relative'
  },
  actionBtn: {
    marginRight: theme.spacing.unit * 2
  },
  noWrap: {
    whiteSpace: 'nowrap'
  },
  addBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px'
  }
});

@inject('store') @observer
class Dashboard extends React.Component {
  render() {
    const {classes, store} = this.props;

    return (
      <Paper className={classes.root}>
        <Typography type='title'>
          Running instances
        </Typography>
        <Tooltip title='Add new configuration'>
          <Button fab color='accent' mini className={classes.addBtn} onClick={()=>Router.push('/config-wizard')}>
            <AddIcon/>
          </Button>
        </Tooltip>
        {store.configurations.length > 0 ?
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell numeric>CPU cores</TableCell>
                <TableCell numeric>RAM</TableCell>
                <TableCell numeric>Storage</TableCell>
                <TableCell>GPU</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                store.configurations.map(cfg => {
                  return (
                    <TableRow key={cfg.id}>
                      <TableCell>{cfg.name}</TableCell>
                      <TableCell>{cfg.location}</TableCell>
                      <TableCell numeric>{cfg.cpuCores}</TableCell>
                      <TableCell numeric>{cfg.ram}</TableCell>
                      <TableCell numeric>{cfg.storage}</TableCell>
                      <TableCell>{cfg.gpu}</TableCell>
                      <TableCell className={classes.noWrap}>
                        <Tooltip title='Edit'>
                          <IconButton className={classes.actionBtn}>
                            <EditIcon/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Pause'>
                          <IconButton className={classes.actionBtn}>
                            <PauseIcon/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                          <IconButton className={classes.actionBtn} onClick={() => {
                            store.deleteConfiguration(cfg.id)
                          }}>
                            <DeleteIcon/>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
          :
          <div>
            <Typography type='caption' align='center'>No configuration was found.</Typography>
          </div>
        }
      </Paper>

    )
  }
}

export default withStyles(styles)(Dashboard);