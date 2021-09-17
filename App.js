import React from 'react';

// Redux and Redux Thunk Libraries
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {store, persistor} from './src/config/ReduxStore';
import RootContainer from './src/navigation/appNavigation';

// Create a App Component
export default class App extends React.Component {
  constructor(properties) {
    super(properties);
    this.state = {
      isJailBroken: false,
    };
  }
  render() {
    console.disableYellowBox = true;
    return (
      <React.Fragment>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RootContainer />
          </PersistGate>
        </Provider>
      </React.Fragment>
    );
  }
}
