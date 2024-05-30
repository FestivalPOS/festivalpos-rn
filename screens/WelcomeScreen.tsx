import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTranslation } from 'react-i18next';

const WelcomeScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('screens.welcome.welcome_to_festivalpos')}
      </Text>
      <Pressable
        onPress={() => navigation.navigate('qr-scanner')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {t('screens.welcome.go_to_qrscanner')}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.buttonBackground,
    padding: 10,
    margin: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: Colors.tint,
  },
});

export default WelcomeScreen;
