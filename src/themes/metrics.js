// Dimenssion of the screen
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Used via Metrics.baseSpace
export const Metrics = {
  baseSpace: 16,
  doubleBaseSpace: 32,
  arrowLarge: 38,
  arrowSmall: 28,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  halfSpace: 8
};

// Make the Metrics available for the Application
export default Metrics;
