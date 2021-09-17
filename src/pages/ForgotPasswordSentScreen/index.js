import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';



import styles from './styles';
import { TextInputCustom } from '../../components';
import { Colors } from '../../themes';

//Redux Library
import {connect} from 'react-redux';

import * as Animatable from 'react-native-animatable';

// Create a component
class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      email: '',
      errorPassword: '',
      errorEmail: '',
    }
  }
  changeValue = async (type, value) => {
    if (type === 'email') {
      if (this.state.errorEmail !== '') {
        await this.setState({
          email: value,
          errorEmail: '',
        });
      } else {
        this.setState({email: value});
      }
    } 
  };
  render() {
    return (
      <React.Fragment>
        <View style={styles.parentContainer}>
          <StatusBar backgroundColor="#FFFFFF" barStyle="light-content" />
          <SafeAreaView>
            <View
              style={styles.scrollView}>
              <Animatable.View
                style={styles.bottomContent}
                animation="fadeInUpBig">
                <View>
                  <Text
                    style={styles.normalLabelStyles}>
                    Selamat datang di iLEAD.
                  </Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.descContent}>
                <View>
                  <Text
                    style={styles.normalLabelStyles}>
                      Berhasil! E-mail dengan link untuk mengubah password-mu sudah dikirim. Coba cek kotak masuk e-mailmu. Cek juga kotak spam-nya ya!                  </Text>
                </View>
                </View>
                <View style={styles.buttonSignin}>
                  <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { }}>
                    <Text
                      style={styles.textSign}>
                      Kirim ulang email
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { this.props.navigation.navigate('Landing');}}>
                    <Text
                      style={[styles.textSign, {color: Colors.blueLightiLeads}]}>
                      Kembali ke Halaman Awal
                    </Text>
                </TouchableOpacity>
                <Animatable.Image
                  animation="bounceIn"
                  duraton="1500"
                  source={require('../../assets/icons/ilead-bottom-logo.png')}
                  style={styles.logo}
                />
              </Animatable.View>
            </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
