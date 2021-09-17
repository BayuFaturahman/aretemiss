// Async Storage Library
import AsyncStorage from '@react-native-community/async-storage';

const ReduxPersist = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    key: 'root',
    timeout: 0,
    storage: AsyncStorage,
    whitelist: ['persistReducer'],
  },
}

export default ReduxPersist
