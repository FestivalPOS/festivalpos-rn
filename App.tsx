import React from 'react';
import NavigationComponent from './components/Navigation.component';
import ContextProvider from './contexts/ContextProvider';
import Toast from 'react-native-toast-message';
import './localization/i18n';

const App = () => {
  return (
    <ContextProvider>
      <NavigationComponent />
      <Toast />
    </ContextProvider>
  );
};

export default App;
