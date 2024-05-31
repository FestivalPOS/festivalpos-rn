import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
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
import { Platform, View } from 'react-native';
import { createURL } from 'expo-linking';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationComponent = () => {
  const { pos } = usePOS();
  const { t } = useTranslation();

  // Using a key that changes with pos.url to force re-render of the navigator
  const drawerKey = pos.url ? 'posDrawer' : 'welcomeDrawer';

  const DrawerNavigator = () => (
    <Drawer.Navigator
      key={drawerKey}
      screenOptions={{ headerTintColor: '#FFFFFF' }}
      initialRouteName={pos.url ? 'pos' : 'welcome'}
      drawerContent={(props) => <BrandedDrawerContent {...props} showLogoutButton={!!pos.url} />}
    >
      {pos.url ? (
        <>
          <Drawer.Screen
            name="pos"
            component={POSScreen}
            options={{
              drawerLabel: 'POS',
              headerTitle: 'POS',
              drawerIcon: getTabBarIcon({ name: 'calculator-outline' }),
            }}
          />
          <Drawer.Screen
            name="settings"
            component={SettingsScreen}
            options={{
              drawerLabel: t('nav.settings'),
              headerTitle: t('nav.settings'),
              drawerIcon: getTabBarIcon({ name: 'settings-outline' }),
            }}
          />
          <Drawer.Screen
            name="about"
            component={AboutScreen}
            options={{
              drawerLabel: t('nav.about'),
              headerTitle: t('nav.about'),
              drawerIcon: getTabBarIcon({ name: 'information-circle-outline' }),
            }}
          />
        </>
      ) : (
        <>
          <Drawer.Screen
            name="welcome"
            component={WelcomeScreen}
            options={{
              drawerLabel: t('nav.welcome'),
              headerTitle: t('nav.welcome'),
              drawerIcon: getTabBarIcon({ name: 'home-outline' }),
            }}
          />
          {Platform.OS === 'web' && (
            <Drawer.Screen
              name="settings"
              component={SettingsScreen}
              options={{
                drawerLabel: t('nav.settings'),
                headerTitle: t('nav.settings'),
                drawerIcon: getTabBarIcon({ name: 'settings-outline' }),
              }}
            />
          )}
          <Drawer.Screen
            name="about"
            component={AboutScreen}
            options={{
              drawerLabel: t('nav.about'),
              headerTitle: t('nav.about'),
              drawerIcon: getTabBarIcon({ name: 'information-circle-outline' }),
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer
      linking={{
        enabled: true,
        prefixes: ['festival-pos://', createURL('/')],
        config: {
          screens: {
            home: {
              screens: {
                pos: 'pos',
                settings: 'settings',
                about: 'about',
                welcome: 'welcome',
              },
            } as any,
            checkout: 'checkout',
            'qr-scanner': 'qrscanner',
          },
        },
      }}
      theme={DarkTheme}
    >
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={DrawerNavigator}
          options={{ headerTitle: 'Home', headerShown: false }}
        />
        <Stack.Screen
          name="checkout"
          component={CheckoutScreen}
          options={{ headerTitle: t('nav.checkout') }}
        />
        <Stack.Screen
          name="qr-scanner"
          component={QRScannerScreen}
          options={{ headerTitle: t('nav.qrscanner') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationComponent;
