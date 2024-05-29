import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DarkTheme } from '@react-navigation/native';
import { usePOS } from '../contexts/POS.context';

// Screens
import POSScreen from '../screens/POSScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationComponent = () => {
  const { pos } = usePOS();

  // Using a key that changes with pos.url to force re-render of the navigator
  const drawerKey = pos.url ? "posDrawer" : "welcomeDrawer";

  const DrawerNavigator = () => (
    <Drawer.Navigator key={drawerKey} screenOptions={{headerTintColor: '#FFFFFF'}} initialRouteName={pos.url ? "POS" : "Welcome"}>
      {pos.url ? (
        <>
          <Drawer.Screen name="POS" component={POSScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="About" component={AboutScreen} />
        </>
      ) : (
        <>
          <Drawer.Screen name="Welcome" component={WelcomeScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="About" component={AboutScreen} />
        </>
      )}
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationComponent;
