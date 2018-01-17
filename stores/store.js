import {types, applySnapshot} from 'mobx-state-tree';
import Router from 'next/router';
import Configuration from "./model/configuration";

let store = null;

const Store = types
  .model({
    isLogged: types.boolean,
    configurations: types.array(Configuration)
  })
  .actions((self) => {
    function login(email, password) {
      self.isLogged = true;
      Router.push('/dashboard');
    }

    function logout() {
      self.isLogged = false;
      Router.push('/index');
    }

    function addConfiguration(cfg) {
      self.configurations.push(cfg);
    }

    function deleteConfiguration(id) {
      let cfgToDelete = self.configurations.find(cfg => cfg.id == id);
      self.configurations.remove(cfgToDelete);
    }

    return {login, logout, deleteConfiguration, addConfiguration}
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
            location: 'Sydney',
            cpuCores: 4,
            ram: 16,
            storage: 120,
            gpu: 'none',
            containerType: 'Docker',
            containerUrl: 'http://somethingsomething'
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