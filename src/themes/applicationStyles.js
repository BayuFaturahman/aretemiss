// Themes
import { Metrics } from './metrics';
import { Colors } from './colors';
import { Fonts } from './fonts';

// Utils
import Utils, { isTableted, hasNotch } from '../common/utils';

const height = Utils.isIOS() && hasNotch ? 86 : Utils.isIOS() ? 80 : isTableted && !Utils.isIOS() ? 76 :56;

// Default Styles for Application
const ApplicationStyles = {
  ...Fonts,
  headerHeight: {
    height: height,
    paddingTop: Utils.isIOS() && hasNotch ? 30 : Utils.isIOS() ? 24 : null
  },
  contentHeight: {
    height: Utils.isIOS() ? (Metrics.screenHeight - height) : (Metrics.screenHeight - height - 24)
  },
  backButtonContainer: {
    height: 40,
    width: 40,
    padding: 10
  },
  backButton: {
    height: 20,
    width: 20,
  },
	errorFont: {
    ...Fonts.tag,
    ...Fonts.robotoRegular,
		color: Colors.dangerRed
	},
  flexContainer: {
    flex: 1,
    backgroundColor: Colors.white
  },
  flexHorizontal: {
    flexDirection: 'row'
  },
  flexVertical: {
    flexDirection: 'column'
  },
  basePadding: {
    padding: isTableted ? Metrics.doubleBaseSpace : Metrics.baseSpace
  },
  basePaddingHorizontal: {
    paddingHorizontal: isTableted ? Metrics.doubleBaseSpace : Metrics.baseSpace
  },
  baseMargin: {
    margin: Metrics.baseSpace
  },
  baseMarginTop: {
    marginTop: isTableted ? Metrics.doubleBaseSpace : Metrics.baseSpace
  },
  baseMarginBottom: {
    marginBottom: isTableted ? Metrics.doubleBaseSpace : Metrics.baseSpace
  },
  baseMarginVertical: {
    marginVertical: isTableted ? Metrics.doubleBaseSpace : Metrics.baseSpace
  },
  background: {
    backgroundColor: Colors.white
  },
  centered: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  justifyAlignCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textAlignRight: {
    textAlign: 'right'
  },
  textAlignLeft: {
    textAlign: 'left'
  },
  textAlignCenter: {
    textAlign: 'center'
  },
  spinnerContainer: {
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    marginTop: -Metrics.screenHeight,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  contentText: {
    ...Fonts.robotoRegular,
    ...Fonts.description,
    lineHeight: 23,
    letterSpacing: 0.25,
    color: Colors.darkGray
  }
};

// Make the Styles available for the Application
export { ApplicationStyles };

