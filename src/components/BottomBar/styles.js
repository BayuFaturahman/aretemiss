
import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../themes';

const styles = {  
  bottomBar: {
	  tabBarOptions: {
		activeTintColor: Colors.dangerRed,
		inactiveTintColor: Colors.mediumGray,
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
			...Fonts.tag,
			alignSelf: 'center',
			paddingBottom: 4
		},
		activeStyle: {
			color: Colors.dangerRed,
		},
		inactiveStyle: {
			color: Colors.mediumGray,
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
	Icons: {
		container: {
			justifyContent: 'center',
			alignItems: 'center'
		  },
		tinyLogo: {
			width: 25,
			height: 25,
		  },
		  logo: {
			width: 75,
			height: 25,
		  },
	}
};

export default styles;
