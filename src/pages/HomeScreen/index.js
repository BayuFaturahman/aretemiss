import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
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
class HomeScreen extends React.Component {
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

  yearsDiff(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    let yearsDiff = date2.getFullYear() - date1.getFullYear();
    return yearsDiff;
  }

  remainingMonths = (targetDate) => {
    var date = new Date().getDate();
    var month = new Date().getMonth();
    var year = new Date().getFullYear();

    let date2 = new Date(targetDate);
    let date1 = new Date();
    date1.setFullYear(year, month, date);

    let years = this.yearsDiff(date1, date2);
    let months = years * 12 + (date2.getMonth() - date1.getMonth());

    return months;
  };

  hideAmount = () => {
    const hideValue = this.state.hideValue;
    this.setState({
      hideValue: !hideValue,
    });
  };

  static getDerivedStateFromProps = (newProps, prevState) => {
    
    return {...prevState};
  };

  componentDidMount() {
    this.props.getAccount();
    this.props.getJurnal();
  }
  allocateAmountToAll() {
    this.props.navigation.navigate('Adding Balance to All Goals', {
      data: this.state.goals,
      liveBalances: this.state.liveBalances,
      amountGeneral: this.state.amountGeneral,
      saving_goals: this.state.saving_goals,
    });
  }

  accountDetailScreen() {
    this.props.navigation.navigate('Account Details');
  }

  render() {
    var totalGoalAmount = this.state.amount - this.state.amountGeneral;
    return (
      <View style={styles.parentContainer}>
        <StatusBar backgroundColor="#1E2171" barStyle="light-content" />
        <SafeAreaView>
          <ScrollView
            style={styles.scrollView}>
              <View
                style={styles.topContent}>
                  <ImageBackground
                    source={require('../../assets/icons/home-top-bg.png')}
                    style={{marginTop: 20,width: '80%', height: '100%', resizeMode: 'cover', position: 'absolute', top: 0, left: 0}}>
                  </ImageBackground>
                  <Text style={styles.title}>
                    Hai, {this.props.account && this.props.account.user_fullname}!
                  </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.white
                }}>
                <View style={[styles.cardContnetData, {marginTop: -30}]}>
                  <View style={styles.titleCardContent}>
                    <Text style={styles.contentText}>
                      Leadership style
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.smallText}>
                    Seperti apa sih gaya kepemimpinan kamu? Dari 14 leadership style, gaya kepemimpinan mana yang paling cocok untuk mendeskripsikan kamu?
                    </Text>
                  </View>

                  <View style={{marginTop: 4}}>
                    <Text style={[styles.contentText, {fontSize: 24, textAlign:'left'}]}>
                    </Text>
                  </View>
                  {/* <View style={{marginTop: 4, marginBottom: 8}}>
                    <Text style={styles.smallText}>
                    </Text>
                  </View> */}
                  <View
                    style={[styles.justifyAlignCenter, styles.flexHorizontal]}>
                  <TouchableOpacity>
                    <Image resizeMode={'contain'} style={{marginRight: 8}} source={require('../../assets/icons/Button-Leadership.png')}/>                  
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image resizeMode={'contain'} style={{marginRight: 8}} source={require('../../assets/icons/Button-quiz.png')}/>                  
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image resizeMode={'contain'} style={styles.iconCalendar} source={require('../../assets/icons/Button-Virtuso.png')}/>                  
                  </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={[styles.cardContnetData, {paddingBottom: 10 }]} onPress={() => this.props.navigation.navigate('Journal')}>
                  <View style={styles.titleCardContent}>
                    <Text style={styles.contentText}>
                      Coaching Journal
                    </Text>
                  </View>
                  {this.props.jurnal.length == 0 && <View
                    style={[styles.flexHorizontal, {backgroundColor: '#FFFFFF', justifyContent: 'center', alignSelf:'flex-start'}]}>
                    <Image resizeMode={'contain'} style={{width: 350, height: 180 }} source={require('../../assets/icons/Empty-State-Journal-Home.png')}/>                  
                  </View>}
                  { this.props.jurnal.length != 0 && <View><View style={[styles.JournalContainer]}>
                      <View style={styles.JournalDateContainer}>
                        <Text style={styles.textDate}>
                          {moment(this.props.jurnal[0].date).format('DD MMM')}
                        </Text>
                      </View>
                      <View style={styles.JournalContentContainer}>
                      {this.props.jurnal[0].journals.map((data)=>{ 
                      return <View style={[styles.containContainTop]}>
                          <View style={styles.dotGreen}/>
                          <Text>
                            {data.journal_title}
                          </Text>
                        </View>
                      })}
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center',}}>
                      <Image resizeMode={'contain'} style={{width: 30, height: 30 }} source={require('../../assets/icons/down-arrow.png')}/>                  
                    </View>
                    </View>
                  }
                </TouchableOpacity>
                <View style={[styles.cardContnetData, {paddingBottom: 10, marginBottom: 50}]}>
                  <View
                    style={[styles.flexHorizontal, {backgroundColor: '#FFFFFF'}]}>
                      <View style={{ margin: 12 }}>
                        <Image
                          source={require(`../../assets/icons/account.png`)}
                        />
                      </View>
                      <View style={{justifyContent: 'center'}}>
                        <Text style={[styles.textAccountName]}>
                          {this.props.account && this.props.account.user_fullname}
                        </Text>
                        <Text style={[styles.textAccountName, {fontSize: 14, fontWeight: 'normal'}]}>
                           {this.props.account && this.props.account.team1_name}
                        </Text>
                      </View>
                  </View>
                </View>
            </View>

          </ScrollView>
        </SafeAreaView>
        {this.props.spinner && (
          <View style={styles.spinnerContainer}>
            <Spinner />
          </View>
        )}
        <View style={styles.buttonFLoat}>
          <Image resizeMode={'contain'} style={{width: 25, height: 25 }} source={require('../../assets/icons/settings.png')}/>                  
        </View>
      </View>
    );
  }
}

// Method to get the Global State Object
const mapStateToProps = (state) => {
  return {
    jurnal: state.account.jurnal,
    account: state.account.account,
  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({
  getJurnal: () => dispatch(getJournalActions()),
  getAccount: () => dispatch(accountActions()),

});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

