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
import PlayIcon from 'material-ui-icons/PlayArrow';
import EditIcon from 'material-ui-icons/Edit';
import Tooltip from "material-ui/Tooltip";
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Router from 'next/router';

const styles = (theme) => ({
  instanceBox: {
    padding: theme.spacing.unit * 4,
    position: 'relative',
    marginBottom: theme.spacing.unit * 4
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
      <div>
        <Paper className={classes.instanceBox}>
          <Typography type='title'>
            Running instances
          </Typography>
          <Tooltip title='Add new configuration'>
              <Button fab color='secondary' mini className={classes.addBtn}
                      onClick={() => Router.push('/logged/config-wizard')}>
                <AddIcon/>
              </Button>
          </Tooltip>
          {store.runningConfigurations.length > 0 ?
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell numeric>CPU cores</TableCell>
                  <TableCell numeric>RAM (GB)</TableCell>
                  <TableCell numeric>Storage (GB)</TableCell>
                  <TableCell>GPU Cores</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  store.runningConfigurations.map(cfg => {
                    return (
                      <TableRow key={cfg.id}>
                        <TableCell>{cfg.name}</TableCell>
                        <TableCell>{cfg.provider.name}</TableCell>
                        <TableCell>{cfg.provider.region.name}</TableCell>
                        <TableCell numeric>{cfg.cpuCores}</TableCell>
                        <TableCell numeric>{cfg.ram}</TableCell>
                        <TableCell numeric>{cfg.storage}</TableCell>
                        <TableCell numeric>{cfg.gpuCores}</TableCell>
                        <TableCell className={classes.noWrap}>
                          <Tooltip title='Edit'>
                            <IconButton className={classes.actionBtn} onClick={()=>Router.push({pathname:'/logged/config-wizard',query:{id:cfg.id}})}>
                              <EditIcon/>
                            </IconButton>
                          </Tooltip>
                          {/*
                        <Tooltip title='Pause'>
                          <IconButton className={classes.actionBtn}>
                            <PauseIcon/>
                          </IconButton>
                        </Tooltip>
                        */}
                          <Tooltip title='Remove and move to Archive'>
                            <IconButton className={classes.actionBtn} onClick={() => {
                              store.archiveConfiguration(cfg.id)
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
            <div style={{textAlign:'center'}}>
              <Typography type='caption' align='center'>No configuration was found.</Typography>
              <br/>
              <Button raised color="secondary" onClick={() => Router.push('/logged/config-wizard')}>Add new</Button>
            </div>
          }
        </Paper>

        {store.archivedConfigurations.length > 0 &&
        <Paper className={classes.instanceBox}>
          <Typography type='title'>
            Archived configurations
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Region</TableCell>
                <TableCell numeric>CPU cores</TableCell>
                <TableCell numeric>RAM (GB)</TableCell>
                <TableCell numeric>Storage (GB)</TableCell>
                <TableCell>GPU Cores</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                store.archivedConfigurations.map(cfg => {
                  return (
                    <TableRow key={cfg.id}>
                      <TableCell>{cfg.name}</TableCell>
                      <TableCell>{cfg.provider.name}</TableCell>
                      <TableCell>{cfg.provider.region.name}</TableCell>
                      <TableCell numeric>{cfg.cpuCores}</TableCell>
                      <TableCell numeric>{cfg.ram}</TableCell>
                      <TableCell numeric>{cfg.storage}</TableCell>
                      <TableCell numeric>{cfg.gpuCores}</TableCell>
                      <TableCell className={classes.noWrap}>
                        <Tooltip title='Start' onClick={() => store.startConfiguration(cfg.id)}>
                          <IconButton className={classes.actionBtn}>
                            <PlayIcon/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete permanently'>
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
        </Paper>
        }
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard);