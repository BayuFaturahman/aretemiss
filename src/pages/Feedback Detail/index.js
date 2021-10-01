import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import * as Progress from 'react-native-progress';
import moment from 'moment'
import styles from './styles';

import {accountActions, getJournalActions, createJournalActions} from '../../actions/index';

import {Spinner, TextInputCustom} from '../../components';

//Redux Library
import {connect} from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';
import utils from '../../common/utils';
import { Colors } from '../../themes';
import { TextAreaCustom } from '../../components/TextInputArea';

// Create a component
class AddFeedbackScreens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
      q6: '',
    };

    this.setValue = this.setValue.bind(this);
  }

  componentDidMount = () => {

  }

  setValue(callback) {
    this.setState(state => ({
      value: callback(state.value)
    }));
  }


  changeValue = async (type, value) => {
    await this.setState({
      [type]: value,
    });
  };

  isDisable = () => {
    return this.state.q1 == '' ||
    this.state.q2 == '' ||
    this.state.q3 == '' ||
    this.state.q4 == '' ||
    this.state.q5 == ''
  }

  isChecked = (type, value) => {
    return this.state[type] == value
  }

  submit = async () => {

  }
  render() {
    const colorBG = this.isDisable() ? '#A8A8A8' : '#054DEC'
    return (
      <View style={styles.parentContainer}>
        <StatusBar backgroundColor="#1E2171" barStyle="light-content" />
        <SafeAreaView style={{flex: 1}}>
              <View
                style={styles.topContent}>
                <Text style={styles.title}>
                  Feedback result
                </Text>
                <Text style={styles.descriptionText}>
                  Berikut adalah hasil feedback sudah dinilai oleh anggota tim-mu.                
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.white,
                  flex: 1
                }}>
                <View style={[styles.cardContnetData, { marginTop: -30 }]}>
                <ScrollView
                    style={styles.scrollView}>
                    <Text style={[styles.descriptionText, {color: 'black', textAlign: 'left'}]}>
                      Dalam skala 1 - 5, seberapa baik saya sudah membangun rapportatau kedekatan di awal sesi?                
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 24, marginRight: 24,
                  marginTop: 16}}>
                      <TouchableOpacity style={this.isChecked('q1', '1') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q1', '2') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q1', '3') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q1', '4') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q1', '5') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                    </View>
                    <Text style={[styles.descriptionText, {color: 'black', textAlign: 'left'}]}>
                      Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan outcome? Berilah rating pada pernyataan berikut ini sesuai dengan sesi coaching yang sudah kamu lakukan.                
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 24, marginRight: 24,
                  marginTop: 16}}>
                      <TouchableOpacity style={this.isChecked('q2', '1') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q2', '2') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q2', '3') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q2', '4') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q2', '5') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                    </View>
                    <Text style={[styles.descriptionText, {color: 'black', textAlign: 'left'}]}>
                      Dalam skala 1 - 5, seberapa baik saya sudah mempraktekan active listening atau mendengar aktif saat sesi berlangsung?
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 24, marginRight: 24,
                  marginTop: 16}}>
                      <TouchableOpacity style={this.isChecked('q3', '1') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q3', '2') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q3', '3') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q3', '4') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q3', '5') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                    </View>
                    <Text style={[styles.descriptionText, {color: 'black', textAlign: 'left'}]}>
                      Dalam skala 1 - 5, seberapa baik saya sudah mengajukan powerful questions atau pertanyaan yang menggugah pada saat sesi berlangsung?
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 24, marginRight: 24,
                  marginTop: 16}}>
                      <TouchableOpacity style={this.isChecked('q4', '1') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q4', '2') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q4', '3') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q4', '4') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q4', '5') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                    </View>
                    <Text style={[styles.descriptionText, {color: 'black', textAlign: 'left'}]}>
                    Dalam skala 1 - 5, seberapa baik saya sudah menggali insights atau pembelajaran yang coachee dapatkan selama sesi berlangsung?
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 24, marginRight: 24,
                  marginTop: 16}}>
                      <TouchableOpacity style={this.isChecked('q5', '1') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q5', '2') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q5', '3') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q5', '4') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q5', '5') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                    </View>
                    <Text style={[styles.descriptionText, {color: 'black'}]}>
                      Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee untuk menyampaikan komitmen di akhir sesi?
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 24, marginRight: 24,
                  marginTop: 16}}>
                      <TouchableOpacity style={this.isChecked('q6', '1') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q6', '2') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q6', '3') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q6', '4') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                      <TouchableOpacity style={this.isChecked('q6', '5') ? styles.dotBlue:styles.dotGrey} disabled={true}/>
                    </View>
                  </ScrollView>
                </View>
            </View>
        </SafeAreaView>
        {this.props.spinner && (
          <View style={styles.spinnerContainer}>
            <Spinner />
          </View>
        )}
      </View>
    );
  }
}

// Method to get the Global State Object
const mapStateToProps = (state) => {
  return {
    jurnal: state.account.jurnal,
    requestJournal: state.account.requestJournal,
    createJournalResponse: state.account.createJournalResponse,
    spinner: state.account.spinner,
  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({
  createJurnal: (params) => dispatch(createJournalActions(params)),
});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(AddFeedbackScreens);

