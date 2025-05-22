import React, { useEffect, useState } from 'react';
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
  interpolate,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Intro: undefined;
};

type Props = {
  onFinishIntro: () => void;
};

const typewriterText = 'Quản Lý Chi Tiêu';
const slogan = 'Kiểm soát tài chính, sống chủ động!';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const NUM_PARTICLES = 18;
const PARTICLE_COLORS = ['#fff176', '#ffd54f', '#b2ff59', '#40c4ff', '#ff8a65', '#f06292', '#fff', '#fffde7'];
const CONFETTI_COUNT = 18;
const CONFETTI_COLORS = ['#ffd700', '#4caf50', '#1976d2', '#ff9800', '#e91e63', '#00bcd4'];

const IntroScreen: React.FC<Props> = ({ onFinishIntro }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const iconScale = useSharedValue(0);
  const iconBounce = useSharedValue(0);
  const iconGlow = useSharedValue(0);
  const shineAnim = useSharedValue(0);
  const textFade = useSharedValue(0);
  const sloganFade = useSharedValue(0);
  const particlesAnim = Array.from({length: NUM_PARTICLES}, () => useSharedValue(0));
  const confettiAnim = Array.from({length: CONFETTI_COUNT}, () => useSharedValue(0));

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(typewriterText.slice(0, i + 1));
      i++;
      if (i === typewriterText.length) {
        clearInterval(interval);
        setTimeout(() => setShowSubtitle(true), 400);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Icon bounce + pulse + glow
    iconScale.value = withSequence(
      withSpring(1.25, { damping: 5 }),
      withSpring(1, { damping: 7 })
    );
    iconBounce.value = withRepeat(
      withSequence(
        withSpring(-22, { damping: 5 }),
        withSpring(0, { damping: 7 })
      ),
      -1,
      true
    );
    iconGlow.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    );
    shineAnim.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
    // Particles random
    particlesAnim.forEach((anim, idx) => {
      anim.value = withDelay(
        idx * 80,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1600 + idx * 20 }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          false
        )
      );
    });
    // Confetti rơi xuống
    confettiAnim.forEach((anim, idx) => {
      anim.value = withDelay(
        idx * 60,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1800 + idx * 30 }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          false
        )
      );
    });
    // Text fade in
    textFade.value = withDelay(400, withTiming(1, { duration: 700 }));
    sloganFade.value = withDelay(1200, withTiming(1, { duration: 700 }));
    // Kết thúc intro sau 5 giây
    const timer = setTimeout(() => {
      onFinishIntro();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Icon animation
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: iconScale.value },
        { translateY: iconBounce.value },
      ],
      shadowOpacity: iconGlow.value,
      shadowRadius: 36 * iconGlow.value,
      elevation: 12,
    };
  });

  // Shine effect
  const shineStyle = useAnimatedStyle(() => {
    const left = interpolate(shineAnim.value, [0, 1], [0, width * 0.4]);
    return {
      position: 'absolute',
      left,
      top: 0,
      width: 40,
      height: width * 0.4,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderRadius: 20,
      transform: [{ rotate: '25deg' }],
      opacity: 0.7,
    };
  });

  // Particles animation
  const renderParticles = () => {
    const r = width * 0.22;
    return particlesAnim.map((anim, idx) => {
      const angle = (2 * Math.PI * idx) / NUM_PARTICLES + Math.random();
      const particleStyle = useAnimatedStyle(() => {
        const progress = anim.value;
        const radius = r + interpolate(progress, [0, 1], [0, 22]);
        const x = width / 2 + radius * Math.cos(angle + progress) - 7;
        const y = height * 0.22 + radius * Math.sin(angle + progress) - 7;
        return {
          position: 'absolute',
          left: x,
          top: y,
          opacity: interpolate(progress, [0, 0.7, 1], [0, 1, 0]),
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: PARTICLE_COLORS[idx % PARTICLE_COLORS.length],
        };
      });
      return <Animated.View key={idx} style={particleStyle} />;
    });
  };

  // Confetti animation
  const renderConfetti = () => {
    return confettiAnim.map((anim, idx) => {
      const confettiStyle = useAnimatedStyle(() => {
        const progress = anim.value;
        const x = interpolate(progress, [0, 1], [width * Math.random(), width * Math.random()]);
        const y = interpolate(progress, [0, 1], [-30, height * 0.7 + Math.random() * 40]);
        const rotate = interpolate(progress, [0, 1], [0, 360]);
        return {
          position: 'absolute',
          left: x,
          top: y,
          width: 12,
          height: 12,
          borderRadius: 3,
          backgroundColor: CONFETTI_COLORS[idx % CONFETTI_COLORS.length],
          opacity: 0.85,
          transform: [{ rotate: `${rotate}deg` }],
        };
      });
      return <Animated.View key={idx} style={confettiStyle} />;
    });
  };

  // Text animation
  const textFadeStyle = useAnimatedStyle(() => ({
    opacity: textFade.value,
    transform: [{ translateY: interpolate(textFade.value, [0, 1], [30, 0]) }],
  }));
  const sloganFadeStyle = useAnimatedStyle(() => ({
    opacity: sloganFade.value,
    transform: [{ translateY: interpolate(sloganFade.value, [0, 1], [30, 0]) }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <LinearGradient
        colors={["#1976d2", "#64b5f6", "#fff"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Confetti hoành tráng */}
      {renderConfetti()}
      {/* Particles lấp lánh */}
      {renderParticles()}
      {/* Icon ví tiền bounce + glow + shine */}
      <View style={styles.iconWrap}>
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <Icon name="wallet" size={width * 0.3} color="#1976d2" />
          <Animated.View style={shineStyle} />
        </Animated.View>
      </View>
      {/* Text động đẹp mắt */}
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.title, textFadeStyle]}>{displayedText}</Animated.Text>
        {showSubtitle && (
          <Animated.Text style={[styles.slogan, sloganFadeStyle]}>{slogan}</Animated.Text>
        )}
      </View>
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
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: width * 0.6,
    position: 'absolute',
    top: height * 0.22,
    left: 0,
    zIndex: 2,
  },
  iconContainer: {
    width: width * 0.4,
    height: width * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.2,
    backgroundColor: '#e3f2fd',
    elevation: 12,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 0 },
    overflow: 'hidden',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: height * 0.48 + 60,
    zIndex: 3,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    fontWeight: '600',
    textShadowColor: '#b3e5fc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});

export default IntroScreen; 