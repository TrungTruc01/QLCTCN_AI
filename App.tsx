import React, { useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginNavigators, MainNavigators } from './src/navigations';
import { ThemeProvider, useTheme } from './src/constants/ThemeContext';
import IntroScreen from './src/screens/Intro/IntroScreen';

const Stack = createNativeStackNavigator();

const AppWrapper = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const { navigationTheme } = useTheme();

  useEffect(() => {
    const app = getApp();
    const unsubscribe = auth(app).onAuthStateChanged(userAuth => {
      setUser(userAuth);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen 
            name="Intro" 
            children={() => <IntroScreen onFinishIntro={() => setIsFirstLaunch(false)} />} 
          />
        ) : user ? (
          <Stack.Screen name="Main" component={MainNavigators} />
        ) : (
          <Stack.Screen name="Login" component={LoginNavigators} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppWrapper;