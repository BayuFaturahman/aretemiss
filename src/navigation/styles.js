// Import libraries
import { StyleSheet } from 'react-native';

// Themes
import { Colors, ApplicationStyles, Fonts } from '../themes';

const { ...applicationStyles } = ApplicationStyles;
const styles = StyleSheet.create({
    ...applicationStyles,
    ...Fonts,
	headerStyle: {
    backgroundColor: Colors.yellow,
    height: 56,
		borderBottomWidth: 0,
		elevation: 0,
		shadowOpacity: 0
	},
	headerTitleStyle: {
		color: Colors.black,
		...Fonts.subContent,
		...Fonts.gothamBold,
		textAlign: 'center',
		alignSelf: 'center',
		flex: 1,
	},
	logo: {
		width: 25,
		height: 25,
	  },
})
export const styleBar = {  
	bottomBar: {
	  tabBarOptions: {
		activeTintColor: Colors.dangerRed,
		inactiveTintColor: Colors.lightGray,
		style: {
		  backgroundColor: Colors.white,
			height: 56,
			alignItems: 'center',
			justifyContent: 'center'
		},
		tabStyle: {
      flexDirection: 'column',
      alignItems: 'center',
			justifyContent: 'center',
    },
		labelStyle: {
			alignSelf: 'center'
		},
		activeStyle: {
		  color: Colors.dangerRed,
		},
		inactiveStyle: {
		  color: Colors.lightGray,
		},
		allowFontScaling: false,
	  },
	  icon: StyleSheet.create({
			container: {
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
			},
	  }),
	},
};


// Make the styles available for Header styles
export default styles;
