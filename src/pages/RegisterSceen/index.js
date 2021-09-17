import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import styles from './styles';
import { TextInputCustom, Spinner } from '../../components';

//Redux Library
import {connect} from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { updateProfileActions, getTeamListActions } from '../../actions';

// Create a component
class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      callName: '',
      email: '',
      team: '',
      errorname: '',
      errorcallName: '',
      erroremail: '',
      errorteam: '',
      open: false,
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.updateProfileResponse != prevProps.updateProfileResponse){
      if(this.props.updateProfileResponse && this.props.updateProfileResponse.message == 'User updated successfully'){
        this.props.navigation.navigate('Home'); 
      }
    }
  }
  componentDidMount = () => {
    this.props.getTeamListActions()
  }
  changeValue = async (type, value) => {
    if (type === 'name') {
      await this.setState({
        name: value,
        errorname: '',
      });
    } else if (type === 'callName') {
      await this.setState({
        callName: value,
        errorcallName: '',
      });
    }else if (type === 'email') {
      await this.setState({
        email: value,
        erroremail: '',
      });
      
    }else if (type === 'team') {
      await this.setState({
        team: value,
        errorteam: '',
      });
    }
  };
  submit = async () => {

    if(this.state.name == '') {
      await this.setState({
        errorname: 'Waduh. Kamu harus masukan nomor hp!',
      });
    } else if(this.state.callName == '') {
      await this.setState({
        errorcallName: 'Waduh. Kamu harus masukan nomor hp!',
      });
    } else if(this.state.email == '') {
      await this.setState({
        erroremail: 'Waduh. Kamu harus masukan nomor hp!',
      });
    } else if(this.state.team == '') {
      await this.setState({
        errorteam: 'Waduh. Kamu harus masukan nomor hp!',
      });
    } else {
      await this.setState({
        errorname: '',
        erroremail: '',
        errorcallName: '',
        errorteam: ''
      });
      const params = await {
        "data":{
          "fullname": this.state.name,
          "nickname": this.state.callName,
          "email": this.state.email,
          "team1Id": this.state.team,
        }, 
        "userid": this.props.signupResponseVerify && this.props.signupResponseVerify.data && this.props.signupResponseVerify.data.userId
      }
      console.log('params',params)

      if(this.props.signupResponseVerify && this.props.signupResponseVerify.data && this.props.signupResponseVerify.data.userId){
        this.props.updateProfileActions(params)
      }
    }
  }
  setOpen(open) {
    this.setState({
      open
    });
  }

  setValue(callback) {
    this.setState(state => ({
      team: callback(state.value)
    }));
  }

  setItems(callback) {
    this.setState(state => ({
      items: callback(state.items)
    }));
  }

  render() {
    const dataDropdown = this.props.teamList.length > 0 ? this.props.teamList : []
    return (
      <React.Fragment>
        <View style={styles.parentContainer}>
          <StatusBar backgroundColor="#FFFFFF" barStyle="light-content" />
          <SafeAreaView>
            <ScrollView
              style={styles.scrollView}>
              <Animatable.View
                style={styles.bottomContent}
                animation="fadeInUpBig">
                <View>
                  <Text
                    style={styles.normalLabelStyles}>
                    Lengkapi profilmu.
                  </Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.descContent}>

                </View>
                <TextInputCustom
                  keyboardType="default"
                  label="Nama lengkap:"
                  value={this.state.name}
                  onChangeText={(e) => this.changeValue('name', e)}
                  onKeyPress={false}
                  format={false}
                  mandatory={true}
                  error={this.state.errorname}
                />
                <TextInputCustom
                  keyboardType="default"
                  label="Nama panggilan:"
                  value={this.state.callName}
                  onChangeText={(e) => this.changeValue('callName', e)}
                  onKeyPress={false}
                  format={false}
                  mandatory={true}
                  error={this.state.errorcallName}
                />
                <TextInputCustom
                  keyboardType="default"
                  label="Alamat e-mail:"
                  value={this.state.email}
                  onChangeText={(e) => this.changeValue('email', e)}
                  onKeyPress={false}
                  format={false}
                  mandatory={true}
                  error={this.state.erroremail}
                />
                <DropDownPicker
                    open={this.state.open}
                    value={this.state.team}
                    style={{
                      borderColor: this.state.errorteam == '' ? '#A8A8A8' : 'red',
                      marginBottom: 16,
                      borderRadius: 30,
                    }}
                    textStyle={{
                      color: '#A8A8A8'
                    }}
                    translation={{
                      PLACEHOLDER: "Pilih Tim"
                    }}
                    items={dataDropdown}
                    setOpen={(callback)=>this.setOpen(callback)}
                    setValue={(callback)=>this.setValue(callback)}
                    setItems={(callback)=>this.setItems(callback)}
                  />

                <View style={styles.buttonSignin}>
                  <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { this.submit() }}>
                    <Text
                      style={styles.textSign}>
                      Simpan
                    </Text>
                  </TouchableOpacity>
                </View>
                <Animatable.Image
                  animation="bounceIn"
                  duraton="1500"
                  source={require('../../assets/icons/ilead-bottom-logo.png')}
                  style={styles.logo}
                />
              </Animatable.View>
            </ScrollView>
          </SafeAreaView>
          {this.props.spinner && (
            <View style={styles.spinnerContainer}>
              <Spinner />
            </View>
          )}
        </View>
      </React.Fragment>
    );
  }
}

// Method to get the Global State Object
const mapStateToProps = (state) => {
  return {
    teamList: state.account.teamList,
    spinner: state.account.spinner,
    signupResponseVerify: state.authentication.signupResponseVerify,
    updateProfileResponse: state.account.updateProfileResponse
  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({
  updateProfileActions: (value) => dispatch(updateProfileActions(value)),
  getTeamListActions: (value) => dispatch(getTeamListActions()),
});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
