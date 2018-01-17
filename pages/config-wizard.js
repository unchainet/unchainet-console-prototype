// @flow weak
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import withRoot from '../src/withRoot';
import Layout from '../components/layout';
import {inject, observer} from 'mobx-react'
import Stepper, {Step, StepLabel, StepContent} from "material-ui/Stepper";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import Router from 'next/router';
import Typography from "material-ui/Typography";
import GoogleMapReact from 'google-map-react';
import Select from "material-ui/Select";
import MenuItem from "material-ui/Menu/MenuItem";
import Input, {InputLabel} from "material-ui/Input";
import {FormControl, FormLabel, FormControlLabel} from "material-ui/Form";
import Radio, {RadioGroup} from 'material-ui/Radio';
import update from 'immutability-helper';

const styles = theme => ({
  actionBtn: {
    marginRight: theme.spacing.unit * 2
  },
  actionsBox: {
    padding: theme.spacing.unit * 2
  },
  stepper: {
    padding: '20px 0 20px 0'
  },
  paper: {
    padding: theme.spacing.unit * 3
  },
  mapBox: {
    height: '300px'
  },
  formControl: {
    marginBottom: theme.spacing.unit * 2
  },
});

@inject('store') @observer
class ConfigWizard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    activeStep: 0,
    data: {
      name: '',
      location: '',
      cpuCores: 1,
      ram: 4,
      gpu:'',
      storage: 10,
      containerType: 'Docker',
      containerUrl: ''
    }
  };

  onPrevious = () => {
    this.setState({activeStep: --this.state.activeStep});
  };

  onNext = (isLast: boolean) => {
    if (isLast) {
      this.props.store.addConfiguration({...this.state.data,id:this.state.data.name});
      Router.push('/dashboard');
    } else {
      this.setState({activeStep: ++this.state.activeStep});
    }
  };

  onCancel = () => {
    Router.push('/dashboard');
  };

  handleChange = name => event => {
    let newState = update(this.state, {
      data: {
        [name]: {$set: event.target.value},
      }
    });
    this.setState(newState);
  };

  render() {
    const {classes} = this.props;
    const {activeStep, data} = this.state;

    return (
      <div>
        <Layout>
          <Grid container justify='center'>
            <Grid item xs={12} md={8}>
              <Paper elevation={4} className={classes.paper}>
                <Typography type="headline">Configuration</Typography>
                <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepper}>
                  <Step>
                    <StepLabel>Name</StepLabel>
                    <StepContent>
                      <TextField label='Configuration Name' fullWidth required value={data.name}
                                 onChange={this.handleChange('name')}/>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}
                               currentStep={activeStep}
                      />
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Location</StepLabel>
                    <StepContent>
                      <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="location">Location</InputLabel>
                        <Select
                          value={data.location}
                          onChange={this.handleChange('location')}
                          required
                          fullWidth
                        >
                          <MenuItem value="Sydney Provider 1">Sydney Provider 1</MenuItem>
                          <MenuItem value="Sydney Provider 2">Sydney Provider 2</MenuItem>
                        </Select>
                      </FormControl>
                      <div className={classes.mapBox}>
                        <GoogleMapReact bootstrapURLKeys={{key: 'AIzaSyA0wwNWl1SoRNcHLmE94ST06IOSAn4WLho'}}
                                        defaultCenter={{lat: -33.8527273, lng: 151.2345705}}
                                        defaultZoom={11}/>
                      </div>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}/>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Hardware Configuration</StepLabel>
                    <StepContent>
                      <FormControl fullWidth className={classes.formControl}>
                        <TextField
                          label="CPU Cores"
                          value={data.cpuCores}
                          onChange={this.handleChange('cpuCores')}
                          type="number"
                          fullWidth
                        />
                      </FormControl>
                      <FormControl fullWidth className={classes.formControl}>
                        <TextField
                          label="RAM (GB)"
                          value={data.ram}
                          onChange={this.handleChange('ram')}
                          type="number"
                          fullWidth
                        />
                      </FormControl>
                      <FormControl fullWidth className={classes.formControl}>
                        <TextField
                          label="Storage (GB)"
                          value={data.storage}
                          onChange={this.handleChange('storage')}
                          type="number"
                          fullWidth
                        />
                      </FormControl>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}/>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Installation Script</StepLabel>
                    <StepContent>
                      <FormControl fullWidth className={classes.formControl}>
                        <FormLabel>Container</FormLabel>
                        <RadioGroup
                          value={data.containerType}
                          onChange={this.handleChange('containerType')}
                        >
                          <FormControlLabel value="Docker" control={<Radio/>} label="Docker"/>
                          <FormControlLabel value="Kubernetes" control={<Radio/>} label="Kubernetes"/>
                        </RadioGroup>
                      </FormControl>
                      <FormControl fullWidth className={classes.formControl}>
                        <TextField
                          label="Container URL"
                          value={data.containerUrl}
                          onChange={this.handleChange('containerUrl')}
                          fullWidth
                          required
                        />
                      </FormControl>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}/>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Price</StepLabel>
                    <StepContent>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel}/>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>All set! Let's launch.</StepLabel>
                    <StepContent>
                      <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                               onCancel={this.onCancel} isLast={true}/>
                    </StepContent>
                  </Step>
                </Stepper>
              </Paper>
            </Grid>
          </Grid>
        </Layout>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(ConfigWizard));

const Actions = ({classes, onPrevious, onNext, onCancel, currentStep, isLast}) => {
  return (
    <div className={classes.actionsBox}>
      <Button raised color='primary' onClick={() => onPrevious()} className={classes.actionBtn}
              disabled={currentStep === 0}>Previous</Button>
      {isLast ?
        <Button raised color='primary' onClick={() => onNext(isLast)} className={classes.actionBtn}>Finish</Button>
        :
        <Button raised color='primary' onClick={() => onNext(isLast)} className={classes.actionBtn}>Next</Button>}
      <Button raised onClick={() => onCancel()} className={classes.actionBtn}>Cancel</Button>
    </div>
  );
};

Actions.defaultProps = {
  isLast: false
};