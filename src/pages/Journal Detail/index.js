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
import DateTimePicker from '@react-native-community/datetimepicker';

import * as Progress from 'react-native-progress';
import moment from 'moment'
import styles from './styles';

import { getJournalDetailActions } from '../../actions/index';

import {Spinner, TextInputCustom} from '../../components';
import DateTimePickerModal from "react-native-modal-datetime-picker";

//Redux Library
import {connect} from 'react-redux';

import { TextAreaCustom } from '../../components/TextInputArea';

// Create a component
class DetailJournalScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      errorTitle: '',
      name: '',
      errorName: '',
      talkingAbout: '',
      errorTalkingAbout: '',
      talkingEfektif: '',
      errorTalkingEfektif: '',
      talkingTingkatan: '',
      errorTalkingTingkat: '',
      talkingNextSession: '',
      errorTalkingNextSession: '',
      jl_lesson_learned: '',
      jl_commitment: '',
      errorValue: '',
      open: false,
      value: null,
      date: new Date(),
      mode: 'date',
      show: false,
      type: null,
    items: [{value: 'A', label: 'A'}]
    };

    this.setValue = this.setValue.bind(this);
  }

  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    this.setState({show: Platform.OS === 'ios', date: currentDate});
  };
  showDatepicker = () => {
    this.setState({mode: 'date', show: true})
  };

  setOpen(open) {
    this.setState({
      open
    });
  }

  setValue(callback) {
    this.setState(state => ({
      value: callback(state.value)
    }));
  }

  setItems(callback) {
    this.setState(state => ({
      items: callback(state.items)
    }));
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    
    return {...prevState};
  };

  componentDidMount() {
    if(this.props.account && this.props.account.team1_id != ""){
      this.props.getJurnal();
    }
  }

  changeValue = async (type, value) => {
    if (type === 'title') {
      await this.setState({
        title: value,
        errorTitle: '',
      });
    } else if (type === 'talkingAbout') {
      await this.setState({
        talkingAbout: value,
        errorTalkingAbout: '',
      });
    } else if (type === 'talkingEfektif') {
      await this.setState({
        talkingEfektif: value,
        errorTalkingEfektif: '',
      });
    } else if (type === 'talkingTingkatan') {
      await this.setState({
        talkingTingkatan: value,
        errorTalkingTingkatan: '',
      });
    } else if (type === 'talkingNextSession') {
      await this.setState({
        talkingNextSession: value,
        errorTalkingNextSession: '',
      });
    }
  };

  lanjutkan = async () => {
    if (this.state.title == '') {
      await this.setState({
        errorTitle: 'Masukan Title',
      });
    } else if (this.state.value == '') {
      await this.setState({
        errorValue: 'Masukan Nama',
      });
    } else if (this.state.talkingAbout == '') {
      await this.setState({
        errorTalkingAbout: 'Masukan Komentar',
      });
    } else if (this.state.talkingEfektif == '') {
      await this.setState({
        errorTalkingEfektif: 'Masukan Komentar',
      });
    } else if (this.state.talkingTingkatan == '') {
      await this.setState({
        errorTalkingTingkatan: 'Masukan Komentar',
      });
    } else if (this.state.talkingNextSession == '') {
      await this.setState({
        errorTalkingNextSession: 'Masukan Komentar',
      });
    }else{
      const params = {
        "coachId": this.props.account.user_id,
        "date": moment(this.state.date).format('YYYY-MM-DD'),
        "title": this.state.title,
        "content": this.state.talkingAbout,
        "strength": 'strength',
        "improvement": this.state.talkingTingkatan,
        "commitment": this.state.talkingNextSession,
        "type": this.state.type == 0 ? 'casual': 'weekly',
        "learnerIds": [
          this.state.value
        ],
      }
      this.props.createRequestJournal(params)
      this.props.navigation.navigate('AddFeedback')
    }
  };
  render() {
    console.log("data", this.props.jurnal && this.props.jurnal.data)
    return (
      <View style={styles.parentContainer}>
        <StatusBar backgroundColor="#1E2171" barStyle="light-content" />
        <SafeAreaView>
          <ScrollView
            style={styles.scrollView}>
              <View style={{marginBottom: 24}}>
                <View style={{flexDirection:'row', marginLeft: 24, marginRight: 24, }}>
                  <View>
                    <View style={styles.titleCardContent}>
                      <Text style={styles.contentText}>
                         Journal entry overview
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'flex-end'}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={{padding: 10, backgroundColor: '#E0E0E0', borderRadius: 15, alignSelf: 'flex-end' }}>
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{marginLeft: 24, marginRight: 24}}>
                  <TextInputCustom
                    value={this.props.jurnal && this.props.jurnal.data && this.props.jurnal.data.journal_title}
                    label={'Title'}
                    onChangeText={(e) => this.changeValue('title', e)}
                    onKeyPress={false}
                    format={false}
                    editable={false}
                    error={this.state.errorTitle}
                  />
                </View>
                <View style={[styles.JournalContainer]}>
                  <TouchableOpacity style={styles.JournalDateContainer}>
                    <Text style={styles.textDate}>
                      {moment(this.state.date).format('DD MMM')}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.JournalContentContainer}>
                    <TextAreaCustom
                    value={this.props.jurnal && this.props.jurnal.data && this.props.jurnal.data.jl_learner_fullname[0]}
                      onChangeText={(e) => this.changeValue('talkingAbout', e)}
                      onKeyPress={false}
                      format={false}
                      editable={false}
                      error={this.state.errorTalkingAbout}
                    />
                    <TextAreaCustom
                      value={this.props.jurnal && this.props.jurnal.data && this.props.jurnal.data.journal_content}
                      label={'Apa yang dibicarakan saat coaching?'}
                      onChangeText={(e) => this.changeValue('talkingAbout', e)}
                      onKeyPress={false}
                      format={false}
                      editable={false}
                      error={this.state.errorTalkingAbout}
                    />
                  </View>
                  
                </View>
                <View style={{marginLeft: 24, marginRight: 24}}>
                  <TextAreaCustom
                      value={this.props.jurnal && this.props.jurnal.data && this.props.jurnal.data.journal_strength}
                    label={'Sebagai coach, apa yang sudah saya lakukan dengan efektif?'}
                    onChangeText={(e) => this.changeValue('talkingEfektif', e)}
                    onKeyPress={false}  
                    format={false}
                    editable={false}
                    error={this.state.errorTalkingEfektif}
                  />
                  <TextAreaCustom
                      value={this.props.jurnal && this.props.jurnal.data && this.props.jurnal.data.journal_improvement}
                      label={'Sebagai coach, kualitas apa yang dapat saya tingkatkan?'}
                    onChangeText={(e) => this.changeValue('talkingTingkatan', e)}
                    onKeyPress={false}
                    format={false}
                    editable={false}
                    error={this.state.errorTalkingTingkat}
                  />
                  <TextAreaCustom
                      value={this.props.jurnal && this.props.jurnal.data && this.props.jurnal.data.journal_commitment}
                      label={'Apa saja yang akan saya lakukan secara berbeda untuk sesi selanjutnya?'}
                    onChangeText={(e) => this.changeValue('talkingNextSession', e)}
                    onKeyPress={false}
                    format={false}
                    editable={false}
                    error={this.state.errorTalkingNextSession}
                  />
                    <TextAreaCustom
                    value={this.state.jl_lesson_learned}
                    label={'Tulislah “lessons learned”-mu di coaching session ini.'}
                    onChangeText={(e) => this.changeValue('talkingTingkatan', e)}
                    onKeyPress={false}
                    format={false}
                    error={this.state.errorTalkingTingkat}
                  />
                  <TextAreaCustom
                    value={this.state.jl_commitment}
                    label={'Komitment apa saja yang sudah disepakati bersama?'}
                    onChangeText={(e) => this.changeValue('talkingNextSession', e)}
                    onKeyPress={false}
                    format={false}
                    editable={false}
                    error={this.state.errorTalkingNextSession}
                  />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginLeft: 24, marginRight: 24,
                  marginTop: 16}}>
                      <TouchableOpacity style={this.state.type == 0 ? styles.dotYellowSelected : styles.dotYellow} onPress={()=>{ this.setState({ type: 0})}}/>
                      <TouchableOpacity style={this.state.type == 1 ? styles.dotPurpleSelected : styles.dotPurple} onPress={()=>{ this.setState({ type: 1})}}/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginLeft: 24, marginRight: 24,
                  marginTop: 32}}>
                  <View style={styles.dotYellowDesc}/>
                  <Text style={{fontSize: 11, marginLeft: 4}}>
                    weekly coaching                      
                  </Text>
                  <View style={styles.dotPurpleDesc}/>
                  <Text style={{fontSize: 11, marginLeft: 4}}>
                    kumpul santai                    
                  </Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginLeft: 24, marginRight: 24, marginTop: 32}}>
                  <TouchableOpacity style={{ backgroundColor: '#054DEC', justifyContent: 'center', width: 164, height: 40, borderRadius: 17}} onPress={()=>{this.lanjutkan()}}>
                  <Text style={{fontSize: 14, color: '#FFFFFF', textAlign:'center'}}>
                    Hasil feedback
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginLeft: 24, marginRight: 24,
                  marginTop: 24}}>
                  <Text style={{fontSize: 11, color: 'red', textAlign: 'center'}}>
                    Penting! Catatan coaching-mu belum tersimpan sampai kamu klik “Submit” setelah melakukan feedback.                  
                  </Text>
                </View>
              </View>

              <DateTimePickerModal
                locale="en_GB"
                mode="date"
                is24Hour={true}
                isVisible={this.state.show}
                date={this.state.date}
                onHide={()=>{this.setState({ show: false})}}
                onConfirm={(data)=>{this.setState({ date: data})}}
                onCancel={()=>{this.setState({ show: false})}}
              />
          </ScrollView>
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
    jurnal: state.account.journalDetail,
    account: state.account.account,
    teamMember: state.account.teamMember,
    spinner: state.account.spinner,
  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({
  getJurnal: () => dispatch(getJournalDetailActions('c0b0046b-e331-43ab-beb0-31d0b4532c5f'))
});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(DetailJournalScreen);

