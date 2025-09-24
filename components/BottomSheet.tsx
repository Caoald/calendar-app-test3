
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from 'react-native';
import { colors } from '../styles/commonStyles';

interface SimpleBottomSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINTS = [0, SCREEN_HEIGHT * 0.9]; // Closed, Open

export default function SimpleBottomSheet({ children, isVisible = false, onClose }: SimpleBottomSheetProps) {
  const [visible, setVisible] = useState(isVisible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      snapToPoint(1); // Open
    } else {
      snapToPoint(0); // Close
    }
  }, [isVisible]);

  const snapToPoint = (pointIndex: number) => {
    const toValue = SNAP_POINTS[pointIndex];
    
    Animated.parallel([
      Animated.spring(translateY, {
        toValue,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(backdropOpacity, {
        toValue: pointIndex === 0 ? 0 : 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (pointIndex === 0) {
        setVisible(false);
      }
    });
  };

  const handleBackdropPress = () => {
    console.log('Backdrop pressed');
    onClose?.();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newTranslateY = Math.max(0, gestureState.dy);
        translateY.setValue(newTranslateY);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dy, vy } = gestureState;
        const shouldClose = dy > 100 || vy > 0.5;
        
        if (shouldClose) {
          onClose?.();
        } else {
          snapToPoint(1);
        }
      },
    })
  ).current;

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: SCREEN_HEIGHT * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.95,
    boxShadow: `0px -4px 20px ${colors.shadow}`,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
});
