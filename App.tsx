import React from 'react';
import NavigationComponent from './components/Navigation.component';
import ContextProvider from './contexts/ContextProvider';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <ContextProvider>
      <NavigationComponent />
      <Toast />
    </ContextProvider>
  );
};

export default App;
