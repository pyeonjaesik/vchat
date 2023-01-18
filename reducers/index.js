import { combineReducers } from 'redux';
import setinfo from './setinfo';
import sidefunc from './sidefunc';

const reducers = combineReducers({
    setinfo,
    sidefunc
})
export default reducers;