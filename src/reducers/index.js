import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import AccountReducer from './accountReducer';

const appReducer = combineReducers({
   authentication: AuthReducer,
   account: AccountReducer
 })

const rootReducer = (state, action) => {
   return appReducer(state, action)
}

export default rootReducer;