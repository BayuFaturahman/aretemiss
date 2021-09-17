import {StyleSheet, Dimensions} from 'react-native';

import {isTableted} from '../../common/utils';
import { Colors, ApplicationStyles } from '../../themes';
const {...applicationStyles} = ApplicationStyles;

const styles = StyleSheet.create({
  ...applicationStyles,
  parentContainer: {
    flex: 1,
    backgroundColor: Colors.white
  },
  topContent: {
    height: 250,
    alignItems: 'center',
    paddingTop: 50,
    justifyContent: 'flex-start',
    paddingRight: 16,
    backgroundColor: Colors.blueLightiLeads,
  },
  titleCardContent: {
    alignSelf: 'flex-start', 
    marginBottom: 14,
    borderBottomColor: Colors.redSoft,
    borderBottomWidth: 4
  },
  goalsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  goalsContainerItem: {
    color: '#4E4E4E',
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  textAllocateAmount: {
    color: '#00C2FF',
    fontSize: 14,
    marginRight: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    alignContent: 'flex-end',
    flex: 1,
  },
  cardContnet: {
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
    width: '85%',
    bottom: 0,
    padding: 15,
    paddingRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 8,
  },
  justifyAlignCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContnetData: {
    backgroundColor: '#FFFFFF',
    borderTopStartRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
    width: '100%',
    padding: 10,
    paddingRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginTop: 8,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTextBig: {
    color: '#393939',
    fontSize: 20,
  },
  cardTextSmall: {
    color: '#4E4E4E',
    fontSize: 15,
  },
  scrollView: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30
  },
  contentText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
  smallText: {
    color: '#000000',
    fontSize: 14,
    marginBottom: 0,
  },
  iconEyes: {
    height: isTableted ? 32 : 15,
    width: isTableted ? 20 : 23,
    marginHorizontal: 8,
  },
  allSavingText: {
    color: '#FFFFFF',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  textCreate: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  noGoalText: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 20,
  },
  containerButton: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    width: '100%',
    bottom: 10,
    borderTopWidth: 2,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
  },
  spinnerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  buttonFLoat: {
    backgroundColor: '#054DEC',
    width: 70,
    height: 70,
    top: 0,
    padding: 15,
    borderRadius: 35,
    left: (Dimensions.get('window').width / 2) - 35
  },
  JournalContainer:{
    width: '100%',
    alignItems: 'center',
    marginLeft: 24,
    justifyContent: 'flex-start',
    marginRight: 24,
    flexDirection: 'row',
    paddingBottom: 24
  },
  JournalDateContainer:{
    width: 75,
    marginTop: 16,
    backgroundColor: Colors.blueLightiLeads,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderRadius: 15, 
    marginBottom: 16,
  },
  JournalContentContainer:{
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    marginLeft: 8
  },
  textDate: {
    color: Colors.white,
    fontSize: 30,
    marginRight: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  containContainTop: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    height: 30,
    borderColor: Colors.black,
    flexDirection: 'row',
  },
  containContainBottom: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    padding: 10,
    flexDirection: 'row',
  },
  dotGreen: {
    width: 20,
    marginRight: 8,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'green'
  },
  progress: {
    margin: 10,
  },
});

export default styles;
