import { types } from 'mobx-state-tree';

const Configuration = types.model({
  id: types.identifier(),
  name: types.string,
  location: types.string,
  cpuCores: types.number,
  ram: types.number,
  storage: types.number,
  gpu: types.string,
  containerType: types.string,
  containerUrl: types.string
});

export default Configuration;