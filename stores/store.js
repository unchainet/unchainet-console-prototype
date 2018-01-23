import {types, applySnapshot} from 'mobx-state-tree';
import Router from 'next/router';
import Configuration from "./model/configuration";
import Region from './model/region';
import Provider from './model/provider';

let store = null;

const Store = types
  .model({
    isLogged: types.boolean,
    configurations: types.array(Configuration),
    regions: types.array(Region),
    providers: types.array(Provider)
  })
  .views(self=>{
    return{
      get runningConfigurations() {
        return self.configurations.filter(i=>i.status === 'running');
      },
      get archivedConfigurations() {
        return self.configurations.filter(i=>i.status === 'archived');
      }
    }
  })
  .actions((self) => {
    function login(email, password) {
      self.isLogged = true;
      Router.push('/logged/dashboard');
    }

    function logout() {
      self.isLogged = false;
      Router.push('/index');
    }

    function addConfiguration(cfg) {
      self.configurations.push(cfg);
    }

    function saveConfiguration(cfg) {
      let index = self.configurations.findIndex(i=>i.id === cfg.id);
      self.configurations[index] = cfg;
    }

    function deleteConfiguration(id) {
      let cfgToDelete = self.configurations.find(cfg => cfg.id == id);
      self.configurations.remove(cfgToDelete);
    }

    function archiveConfiguration(id) {
      let cfgToArchive = self.configurations.find(cfg => cfg.id == id)
      cfgToArchive.status = 'archived';
    }

    function startConfiguration(id) {
      let cfgToStart = self.configurations.find(cfg => cfg.id == id)
      cfgToStart.status = 'running';
    }

    function checkPermission() {
      if(!self.isLogged) {
        // ToDo: Implement server side redirection
        window.location = "/";
      }
    }

    return {login, logout, deleteConfiguration, addConfiguration, checkPermission, archiveConfiguration, startConfiguration,saveConfiguration}
  });

export function initStore(isServer, snapshot = null) {
  if (isServer) {
    store = Store.create(
      {
        isLogged: false,
        configurations: [
          {
            id: "1",
            name: 'Sydney S1',
            cpuCores: 4,
            ram: 16,
            storage: 120,
            gpu: 'none',
            containerType: 'Kubernetes',
            dockerConfig: {
              imageName:'',
              repositoryUrl:''
            },
            kubernetesConfig: {
              script: 'some script'
            },
            provider: '1',
            auctionedPricing: 2,
            eventualAvailability: 4,
            guaranteedAvailability: 0,
            price: 10,
            priceType: "eventualAvailability",
            status: 'running'
          }
        ],
        regions: [
          {
            id:'1',
            name: 'Australia',
            zoom: 4,
            location: {lat: -23.268353, lng: 134.185811}
          },
          {
            id:'2',
            name: 'China',
            zoom: 5,
            location: {lat: 23.1253503, lng: 112.9476547}
          }
        ],
        providers: [
          {
            id: '1',
            name: 'Provider ABC',
            region: '1',
            location: {lat: -33.8980122, lng: 151.1802367}
          },
          {
            id: '2',
            name: 'Provider 123',
            region: '1',
            location: {lat: -33.879083, lng: 151.1954023}
          }
        ]
      });
  }
  if (store === null) {
    store = Store.create(
      {
        isLogged: false,
        configurations: []
      });
  }

  if (snapshot) {
    applySnapshot(store, snapshot)
  }
  return store
}