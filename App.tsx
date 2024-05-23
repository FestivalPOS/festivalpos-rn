import 'react-native-gesture-handler';
import * as React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';


// Screens
import POSScreen from './screens/POSScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen';
import CheckoutScreen from './screens/CheckoutScreen';

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{headerTintColor: '#FFFFFF'}} initialRouteName="POSScreen">
      <Drawer.Screen name="POS" component={POSScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
        <RootStack.Navigator screenOptions={{ presentation: 'modal' }}>
            <RootStack.Screen
                name="Main"
                component={DrawerNavigator}
                options={{ headerShown: false }}
            />
            <RootStack.Screen name="Checkout" component={CheckoutScreen} />
        </RootStack.Navigator>
    </NavigationContainer>
  );
}
