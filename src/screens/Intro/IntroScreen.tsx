import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Intro: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  onFinishIntro: () => void;
};

const IntroScreen: React.FC<Props> = ({ onFinishIntro }) => {
  const navigation = useNavigation<NavigationProp>();
  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);
  const circleScale = useSharedValue(0);

  useEffect(() => {
    // Circle animation
    circleScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });

    // Icon animation sequence
    iconScale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 8 })
    );
    iconOpacity.value = withSpring(1);
    iconRotate.value = withTiming(360, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    // Text animation with delay
    textOpacity.value = withDelay(
      800,
      withSpring(1, { damping: 8 })
    );
    textTranslateY.value = withDelay(
      800,
      withSpring(0, { damping: 8 })
    );

    // Navigate to main app after animation
    const timer = setTimeout(() => {
      onFinishIntro();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: circleScale.value }],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: iconScale.value },
        { rotate: `${iconRotate.value}deg` }
      ],
      opacity: iconOpacity.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View style={[styles.circleContainer, circleAnimatedStyle]}>
        <View style={styles.circle} />
      </Animated.View>
      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        <Icon name="wallet" size={width * 0.3} color="#4A90E2" />
      </Animated.View>
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.title}>Quản Lý Chi Tiêu</Text>
        <Text style={styles.subtitle}>Giúp bạn quản lý tài chính thông minh</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#F5F9FF',
  },
  iconContainer: {
    width: width * 0.4,
    height: width * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default IntroScreen; 