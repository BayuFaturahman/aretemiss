import {
   SET_AUTH_TOKEN
} from '../actions/types';

const INITIAL_STATE = {
   authToken: null,
};


export default (state, action) => {
   if (typeof state === 'undefined') {
      return INITIAL_STATE
   }
   switch (action.type) {
      case SET_AUTH_TOKEN:
         return { ...state, authToken: action.payload }
   default:
         return state;
   }
};