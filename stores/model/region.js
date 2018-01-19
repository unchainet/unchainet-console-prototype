import { types } from 'mobx-state-tree';
import Location from './location';

const Region = types.model({
  id: types.identifier(),
  name: types.string,
  location: Location,
  zoom: types.number
});

export default Region;