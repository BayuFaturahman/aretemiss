import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  BackHandler
} from 'react-native';

import styles from './styles';

//Redux Library
import {connect} from 'react-redux';

import * as Animatable from 'react-native-animatable';

// Create a component
class LandingScreen extends React.Component {
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  handleBackButton() {
    return true;
  }
  render() {
    return (
      <React.Fragment>
        <View style={styles.parentContainer}>
          <StatusBar backgroundColor="#FFFFFF" barStyle="light-content" />
          <SafeAreaView>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              <Animatable.View
                style={styles.bottomContent}
                animation="fadeInUpBig">
                <Animatable.Image
                  animation="bounceIn"
                  duraton="1500"
                  source={require('../../assets/icons/ilead-logo.png')}
                  style={styles.logo}
                />
                <View style={styles.buttonRegister}>
                  <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { this.props.navigation.navigate('VerifikasiHP');}}>
                    <Text
                      style={styles.textSign}>
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonSignin}>
                  <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { this.props.navigation.navigate('Login');}}>
                    <Text
                      style={styles.textSign}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </React.Fragment>
    );
  }
}

// Method to get the Global State Object
const mapStateToProps = (state) => {
  return {

  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({

});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(LandingScreen);
