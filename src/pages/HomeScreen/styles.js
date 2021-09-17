import {StyleSheet} from 'react-native';

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
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: Colors.blueLightiLeads,
    borderBottomRightRadius: 45,
    borderBottomLeftRadius: 45,
  },
  titleCardContent: {
    alignItems: 'flex-start',
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
  textAccountName: {
    color: Colors.blueLightiLeads,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Brandon Grotesque'
  },
  cardContnet: {
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
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
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    width: '90%',
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
    height: '100%',
    backgroundColor: Colors.white,
    marginBottom: 70,
    paddingBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginRight: 16,
    textAlign: 'center',
    borderBottomColor: Colors.redSoft,
    borderBottomWidth: 4
  },
  contentText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
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
    backgroundColor: Colors.blueLightiLeads,
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    borderRadius: 25
  },
  progress: {
    margin: 10,
  },
  JournalContainer:{
    width: '100%',
    alignItems: 'center',
    flex:1,
    marginLeft: 24,
    justifyContent: 'flex-start',
    marginRight: 24,
    flexDirection: 'row',
  },
  JournalDateContainer:{
    width: 75,
    height: '100%',
    marginTop: 16,
    backgroundColor: Colors.blueLightiLeads,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderRadius: 15, 
    marginBottom: 16,
  },
  JournalContentContainer:{
    height: 150,
    justifyContent: 'space-between',
    marginLeft: 8
  },
  containContainTop: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    padding: 10,
    height: 50,
    borderColor: Colors.black,
    flexDirection: 'row',
  },  textDate: {
    color: Colors.white,
    fontSize: 30,
    marginRight: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
});

export default styles;
