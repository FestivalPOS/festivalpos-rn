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
import { useTranslation } from 'react-i18next';
import { getTabBarIcon } from '../helpers/icons';
import BrandedDrawerContent from './BrandedDrawer.component';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationComponent = () => {
  const { pos } = usePOS();
  const { t } = useTranslation();

  // Using a key that changes with pos.url to force re-render of the navigator
  const drawerKey = pos.url ? "posDrawer" : "welcomeDrawer";

  const DrawerNavigator = () => (
    <Drawer.Navigator key={drawerKey} screenOptions={{headerTintColor: '#FFFFFF'}} initialRouteName={pos.url ? "POS" : "Welcome"} drawerContent={BrandedDrawerContent}>
      {pos.url ? (
        <>
          <Drawer.Screen name="POS" component={POSScreen} options={{drawerIcon: getTabBarIcon({ name: 'calculator-outline' })}} />
          <Drawer.Screen name={t("nav.settings")} component={SettingsScreen} options={{drawerIcon: getTabBarIcon({ name: 'settings-outline' })}} />
          <Drawer.Screen name={t("nav.about")} component={AboutScreen} options={{drawerIcon: getTabBarIcon({ name: 'information-circle-outline' })}} />
        </>
      ) : (
        <>
          <Drawer.Screen name={t("nav.welcome")} component={WelcomeScreen} options={{drawerIcon: getTabBarIcon({ name: 'home-outline' })}} />
          <Drawer.Screen name={t("nav.about")} component={AboutScreen} options={{drawerIcon: getTabBarIcon({ name: 'information-circle-outline' })}} />
        </>
      )}
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name={t("nav.checkout")} component={CheckoutScreen} />
        <Stack.Screen name={t("nav.qrscanner")} component={QRScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationComponent;
