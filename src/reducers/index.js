import { combineReducers } from 'redux';
import merchant_reducer from './merchant_reducer'
import user_reducer from './user_reducer';

export default combineReducers({
    orders: merchant_reducer,
    user: user_reducer
})