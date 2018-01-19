import { types } from 'mobx-state-tree';
import Provider from './provider';

const Configuration = types.model({
  id: types.identifier(),
  name: types.string,
  cpuCores: 2,
  ram: 4,
  storage: 20,
  gpuCores: 0,
  containerType: types.string,
  provider: types.reference(Provider),
  dockerConfig: types.frozen,
  kubernetesConfig: types.frozen,
  priceType: types.enumeration("priceType", ["eventualAvailability", "guaranteedAvailability","longTermBooking"]),
  price: 0
});

export default Configuration;