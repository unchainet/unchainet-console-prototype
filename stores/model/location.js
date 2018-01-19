import { types } from 'mobx-state-tree';

const Location = types.model({
  lat: types.number,
  lng: types.number
});

export default Location;