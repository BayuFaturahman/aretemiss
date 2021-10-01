import React from 'react';

import {View, Image, Text, Animated, ActivityIndicator} from 'react-native';
import api from '../../services/api';

//Redux Library
import {connect} from 'react-redux';

import styles from './styles';

// Create a component
class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LogoAnime: new Animated.Value(0),
      LogoText: new Animated.Value(0),
      loadingSpinner: false,
    };
  }

  setTimePassed() {
    this.setState({timePassed: true});
  }

  componentDidMount() {
    const {LogoAnime, LogoText} = this.state;
    Animated.parallel([
      Animated.spring(LogoAnime, {
        toValue: 1,
        tension: 10,
        friction: 2,
        duration: 1500,
        useNativeDriver: true,
      }).start(),

      Animated.timing(LogoText, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({
        loadingSpinner: true,
      });

      this.timeoutHandle = setTimeout(() => {
        if(this.props.token !=  null){
          api.setAuthToken(this.props.token)
          this.props.navigation.navigate('Home');
        }else{
          this.props.navigation.navigate('Landing');
        }
      }, 2000);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle);
  }

  render() {
    return (
      <View style={styles.parentContainer}>
        <Animated.View
          style={{
            opacity: this.state.LogoAnime,
          }}>
          <Image source={require('../../assets/icons/ilead-logo.png')} />
        </Animated.View>
      </View>
    );
  }
}

// Method to get the Global State Object
const mapStateToProps = (state) => {
  return {
    token: state.persistReducer.authToken,
  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({
});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
