import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import * as Progress from 'react-native-progress';
import moment from 'moment'
import styles from './styles';

import {accountActions, getJournalActions} from '../../actions/index';

import {Spinner} from '../../components';

//Redux Library
import {connect} from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';
import utils from '../../common/utils';
import { Colors } from '../../themes';

// Create a component
class JournalScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goals: [],
      accountBalance: [],
      amount: '',
      generalSaving: {},
      amountGeneral: '',
      hideValue: true,
      liveBalances: [],
      saving_goals: '',
    };
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    
    return {...prevState};
  };

  render() {
    return (
      <View style={styles.parentContainer}>
        <StatusBar backgroundColor="#1E2171" barStyle="light-content" />
        <SafeAreaView style={{flex: 1}}>
            <View
              style={styles.topContent}>
              <Text style={styles.title}>
                Coaching Journal
              </Text>
              <Text style={styles.descriptionText}>
                  Setiap journal entry yang kamu catat di iLEAD akan memberikan kesempatan bagi anggota tim kamu untuk memberikan feedback kepadamu juga lho! Anggota tim bisa memberikan feedback untuk setiap journal entry yang kamu catat.
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.white,
                flex: 1
              }}>
              <View style={[styles.cardContnetData, {marginTop: -30}]}>
                <View style={{top: -35}}>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('AddJournal')}} style={[styles.buttonFLoat]} >
                  <Image resizeMode={'contain'} style={{width: 40, height: 40 }} source={require('../../assets/icons/add-task.png')}/>                  
                </TouchableOpacity>
                </View>
                <View style={styles.titleCardContent}>
                  <Text style={styles.contentText}>
                    Catatan jurnal coaching 
                  </Text>
                </View>
                <View
                  style={[styles.justifyAlignCenter, styles.flexHorizontal,{width: '100%', flex: 1, backgroundColor: '#FFFFFF'}]}>
                <ScrollView
                    style={styles.scrollView}>
                  {this.props.jurnal.length != 0 &&  
                    this.props.jurnal.map((items)=>{
                    return <View style={[styles.JournalContainer]}>
                      <View style={[styles.JournalDateContainer, {height: (items.journals.length * 75)+ 10}]}>
                        <Text style={styles.textDate}>
                          {moment(items.date).format('DD MMM')}
                        </Text>
                      </View>
                      <View style={styles.JournalContentContainer}>
                      {items.journals.map((data, index)=>{
                      return <TouchableOpacity 
                        style={[styles.containContainTop, { borderBottomWidth: index == items.journals.length -1 ? 0 : 1}]}
                        onPress={()=>{this.props.navigation.navigate('DetailJournal')}}
                        >
                          <View style={styles.dotGreen}/>
                          <Text>
                            {data.journal_title}
                          </Text>
                        </TouchableOpacity>
                      })}
                      </View>
                      </View>
                    })}
                  </ScrollView>
                  {this.props.jurnal.length == 0 && <Image style={{height: 300, resizeMode: 'contain'}} source={require('../../assets/icons/empty-state-jurnal.png')}/> }
                </View>
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
    getJurnalResponse: state.account.getJurnalResponse,
  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({
  getJurnal: () => dispatch(getJournalActions()),
});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(JournalScreen);

