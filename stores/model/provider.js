import { types } from 'mobx-state-tree';
import Region from "./region";
import Location from './location';

const Provider = types.model({
  id: types.identifier(),
  name: types.string,
  region: types.reference(Region),
  location: Location
});

export default Provider;