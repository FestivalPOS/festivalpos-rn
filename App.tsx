import React from 'react';
import NavigationComponent from './components/Navigation.component';
import ContextProvider from './contexts/ContextProvider';
import Toast from 'react-native-toast-message';
import './localization/i18n';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView>
      <ContextProvider>
        <NavigationComponent />
        <Toast />
      </ContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;
