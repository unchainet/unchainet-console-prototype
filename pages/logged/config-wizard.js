// @flow weak
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import withRoot from '../../src/withRoot';
import Layout from '../../components/layout';
import {inject, observer} from 'mobx-react'
import Stepper, {Step, StepContent, StepLabel} from "material-ui/Stepper";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import Router from 'next/router';
import Typography from "material-ui/Typography";
import Select from "material-ui/Select";
import MenuItem from "material-ui/Menu/MenuItem";
import {InputLabel} from "material-ui/Input";
import {FormControl, FormControlLabel, FormLabel} from "material-ui/Form";
import Radio, {RadioGroup} from 'material-ui/Radio';
import update from 'immutability-helper';
import Map from '../../components/map';
import {Marker, InfoWindow} from "react-google-maps";
import queryString from 'query-string';

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
  formControl: {
    marginBottom: theme.spacing.unit * 2
  },
  formControlBlock: {
    marginBottom: theme.spacing.unit * 2,
    display: 'block'
  },
  contentWrapper: {
    paddingLeft: '12px'
  },
  infoBox: {
    backgroundColor: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '2px',
    width: '140px'
  },
  radioDescription: {
    fontSize: '12px',
    fontStyle: 'Italic'
  },
  radioLabel: {
    paddingLeft: '10px'
  },
  radioWithDesc: {
    padding: '0 0 20px 0'
  }
});

@inject('store') @observer
class ConfigWizard extends React.Component {
  componentDidMount() {
    let params = queryString.parse(location.search);
    if (params.id) {
      let cfgToEdit = this.props.store.configurations.find(i => i.id == params.id);
      this.setState(update(this.state, {data: {$set: cfgToEdit.toJSON()}}));
    }
    this.setState({isNew: !params.id});
  }

  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    activeStep: 0,
    region: '',
    mapLocation: {lat: -33.8527273, lng: 151.2345705},
    mapZoom: 11,
    infoBoxSelectedProviderId: null,
    isNew: true,
    data: {
      name: '',
      cpuCores: 1,
      ram: 4,
      gpuCores: 0,
      storage: 10,
      containerType: 'Docker',
      provider: '',
      dockerConfig: {
        repositoryUrl: '',
        imageName: ''
      },
      kubernetesConfig: {
        script: ''
      },
      priceType: '',
      price: 0,
      status: 'running'
    }
  };

  toggleInfoBox = (id = null) => {
    this.setState({infoBoxSelectedProviderId: id});
  };

  onPrevious = () => {
    this.setState({activeStep: --this.state.activeStep});
  };

  onNext = (isLast: boolean) => {
    if (isLast) {
      if (this.state.isNew) {
        this.props.store.addConfiguration({...this.state.data, id: this.state.data.name});
      } else {
        this.props.store.saveConfiguration(this.state.data);
      }
      Router.push('/logged/dashboard');
    } else {
      this.setState({activeStep: ++this.state.activeStep});
    }
  };

  onCancel = () => {
    Router.push('/logged/dashboard');
  };

  handleChange = (name, formData = true, type = 'text') => event => {
    let newState = null;
    let value = type === 'int' ? parseInt(event.target.value) : event.target.value;

    if (formData === true) {
      newState = update(this.state, {
        data: {
          [name]: {$set: value},
        }
      });
    } else {
      newState = update(this.state, {
        [name]: {$set: value},
      });
    }
    if (name === 'provider') {
      newState.infoBoxSelectedProviderId = event.target.value;
    }
    this.setState(newState);
  };

  changeMapRegion = (regionId) => {
    const {regions} = this.props.store;
    let region = regions.find(i => i.id == regionId);
    this.setState({mapLocation: region.location, mapZoom: region.zoom});
  };

  selectProvider = (id) => {
    this.setState(update(this.state, {
      data: {
        provider: {$set: id}
      }
    }));
  };

  render() {
    const {classes, store} = this.props;
    const {activeStep, data} = this.state;
    const {providers, regions} = store;
    let {state} = this;

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
                      <div className={classes.contentWrapper}>
                        <TextField label='Configuration Name' fullWidth required value={data.name}
                                   onChange={this.handleChange('name')}/>
                        <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                                 onCancel={this.onCancel}
                                 currentStep={activeStep}
                        />
                      </div>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Provider</StepLabel>
                    <StepContent>
                      <div className={classes.contentWrapper}>
                        <FormControl fullWidth className={classes.formControl}>
                          <InputLabel htmlFor="location">Region</InputLabel>
                          <Select
                            value={state.region}
                            onChange={(e) => {
                              this.handleChange('region', false)(e);
                              this.changeMapRegion(e.target.value);
                            }}
                            required
                          >
                            {regions.map(i => (
                              <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl fullWidth className={classes.formControl}>
                          <InputLabel htmlFor="location">Provider</InputLabel>
                          <Select
                            value={data.provider}
                            onChange={this.handleChange('provider')}
                            required
                            fullWidth
                          >
                            {providers.filter(i => (i.region.id === state.region) || !state.region).map(i => (
                              <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Map
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0wwNWl1SoRNcHLmE94ST06IOSAn4WLho&v=3.exp&libraries=geometry,drawing,places"
                          loadingElement={<div/>}
                          containerElement={<div style={{height: `400px`}}/>}
                          mapElement={<div style={{height: `100%`}}/>}
                          center={state.mapLocation}
                          zoom={state.mapZoom}
                        >
                          {providers.map(i => (
                            <Marker
                              key={i.id}
                              position={i.location}
                              onClick={() => this.toggleInfoBox(i.id)}

                            >
                              {state.infoBoxSelectedProviderId === i.id &&
                              <InfoWindow
                                onCloseClick={() => this.toggleInfoBox(null)}

                              >
                                <div className={classes.infoBox}>
                                  <div>{i.name}</div>
                                  <div><Button onClick={() => this.selectProvider(i.id)}>Select</Button></div>
                                </div>
                              </InfoWindow>}
                            </Marker>
                          ))}
                        </Map>
                        <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                                 onCancel={this.onCancel}/>
                      </div>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Hardware Configuration</StepLabel>
                    <StepContent>
                      <div className={classes.contentWrapper}>
                        <FormControl className={classes.formControlBlock}>
                          <TextField
                            label="CPU Cores"
                            value={data.cpuCores}
                            onChange={this.handleChange('cpuCores', true, 'int')}
                            type="number"
                          />
                        </FormControl>
                        <FormControl className={classes.formControlBlock}>
                          <TextField
                            label="RAM (GB)"
                            value={data.ram}
                            onChange={this.handleChange('ram', true, 'int')}
                            type="number"
                          />
                        </FormControl>
                        <FormControl className={classes.formControlBlock}>
                          <TextField
                            label="Storage (GB)"
                            value={data.storage}
                            onChange={this.handleChange('storage', true, 'int')}
                            type="number"
                          />
                        </FormControl>
                        <FormControl className={classes.formControlBlock}>
                          <TextField
                            label="GPU Cores"
                            value={data.gpuCores}
                            onChange={this.handleChange('gpuCores', true, 'int')}
                            type="number"
                          />
                        </FormControl>
                        <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                                 onCancel={this.onCancel}/>
                      </div>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Price</StepLabel>
                    <StepContent>
                      <div className={classes.contentWrapper}>
                        <FormControl>
                          <FormLabel style={{marginBottom: '20px'}}>Pricing</FormLabel>
                          <RadioGroup
                            value={data.priceType}
                            onChange={this.handleChange('priceType')}
                          >
                            <FormControlLabel value="eventualAvailability" control={<Radio/>}
                                              classes={{root: classes.radioWithDesc}}
                                              label={<RadioLabel classes={classes} label="Eventual availability"
                                                                 description={<div>
                                                                   Set the maximum price you are willing to pay for your
                                                                   instance, then pay the price of second
                                                                   highest bidder - great for workloads where occasional
                                                                   dropouts are not important like research,
                                                                   AI
                                                                   training etc.
                                                                 </div>}/>}/>
                            <FormControlLabel value="guaranteedAvailability" control={<Radio/>}
                                              classes={{root: classes.radioWithDesc}}
                                              label={<RadioLabel classes={classes} label="Guaranteed Availability"
                                                                 description={<div>
                                                                   Pay fixed price per minute, your instance is
                                                                   available
                                                                   until you stop it.
                                                                 </div>}/>}/>
                            <FormControlLabel value="longTermBooking" control={<Radio/>}
                                              classes={{root: classes.radioWithDesc}}
                                              label={<RadioLabel classes={classes} label="Long-term Booking"
                                                                 description={<div>
                                                                   Great for hosting websites "and always" on services -
                                                                   pay smaller price than on Guaranteed
                                                                   availability
                                                                 </div>}/>}/>
                          </RadioGroup>
                        </FormControl>
                        <FormControl className={classes.formControl} style={{marginTop: '10px'}}>
                          <TextField
                            label="Price"
                            value={data.price}
                            onChange={this.handleChange('price', true, 'int')}
                            type="number"
                          />
                        </FormControl>
                        <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                                 onCancel={this.onCancel}/>
                      </div>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Installation Script</StepLabel>
                    <StepContent>
                      <div className={classes.contentWrapper}>
                        <FormControl fullWidth className={classes.formControl}>
                          <RadioGroup
                            value={data.containerType}
                            onChange={this.handleChange('containerType')}
                          >
                            <FormControlLabel value="Docker" control={<Radio/>} label="Docker"/>
                            <FormControlLabel value="Kubernetes" control={<Radio/>} label="Kubernetes"/>
                          </RadioGroup>
                        </FormControl>
                        {data.containerType === 'Docker' ?
                          <div>
                            <FormControl fullWidth className={classes.formControl}>
                              <TextField
                                label="Repository URL"
                                value={data.dockerConfig.repositoryUrl}
                                onChange={(e) => this.setState(update(this.state, {data: {dockerConfig: {repositoryUrl: {$set: e.target.value}}}}))}
                                fullWidth
                                required
                              />
                            </FormControl>
                            <FormControl fullWidth className={classes.formControl}>
                              <TextField
                                label="Image Name"
                                value={data.dockerConfig.imageName}
                                onChange={(e) => this.setState(update(this.state, {data: {dockerConfig: {imageName: {$set: e.target.value}}}}))}
                                fullWidth
                                required
                              />
                            </FormControl>
                          </div>
                          :
                          <FormControl fullWidth className={classes.formControl}>
                            <TextField
                              label="Script"
                              value={data.kubernetesConfig.script}
                              onChange={(e) => this.setState(update(this.state, {data: {kubernetesConfig: {script: {$set: e.target.value}}}}))}
                              fullWidth
                              required
                            />
                          </FormControl>}
                        <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                                 onCancel={this.onCancel}/>
                      </div>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>All set! Let's launch.</StepLabel>
                    <StepContent>
                      <div className={classes.contentWrapper}>
                        <Actions classes={classes} onPrevious={this.onPrevious} onNext={this.onNext}
                                 onCancel={this.onCancel} isLast={true}/>
                      </div>
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

const RadioLabel = ({classes, label, description}) => (
  <div className={classes.radioLabel}>
    <div>{label}</div>
    <div className={classes.radioDescription}>{description}</div>
  </div>
);