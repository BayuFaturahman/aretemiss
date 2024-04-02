import { Colors } from '@styles/index';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Text } from "@components"
import { rHeight } from '@styles/Spacing';

interface Props {
  showToast: boolean;
  message?: string;
  type?: 'top' | 'bottom';
  duration?: number; // Duration in milliseconds
  toggleToast?: () => void; // Callback function to toggle showToast
}

const Toast: React.FC<Props> = ({ showToast, message, type, duration = 2000, toggleToast }) => {
  const [translateY] = useState(new Animated.Value(showToast ? 0 : (type === 'top' ? -100 : 100)));

  useEffect(() => {
    animateToast(showToast);
    if (showToast && duration > 0) {
      const timeout = setTimeout(() => {
        toggleToast && toggleToast();
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [showToast, type, duration, toggleToast]);

  const animateToast = (showToast: boolean) => {
    Animated.spring(translateY, {
      toValue: showToast ? 0 : (type === 'top' ? -16 : 100),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.commonToastStyle,
        type === 'top' ? styles.topToastStyle : styles.bottomToastStyle,
        { transform: [{ translateY }] },
      ]}
    >
      <Text type='body' style={{fontSize:16,textAlign:'center'}}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  commonToastStyle: {
    borderRadius: 20,
    margin: rHeight(2),
    padding: rHeight(1.5),
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'absolute',
    right: 0,
    left: 0,
    zIndex: 100,
  },
  topToastStyle: {
    backgroundColor: Colors.WHITE,
    top: 0,
  },
  bottomToastStyle: {
    backgroundColor: Colors.WHITE,
    bottom: 0,
  },
});

export default Toast;
