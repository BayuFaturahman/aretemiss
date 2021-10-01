import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import AccountReducer from './accountReducer';
import PersistReducer from './persistReducer';

const appReducer = combineReducers({
   authentication: AuthReducer,
   account: AccountReducer,
   persistReducer: PersistReducer, 
 })

const rootReducer = (state, action) => {
   return appReducer(state, action)
}

export default rootReducer;