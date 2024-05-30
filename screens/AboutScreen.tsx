// AboutScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTranslation } from 'react-i18next';

export default function AboutScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('screens.about.title')}</Text>
      <Text style={styles.text}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
    padding: 20
  },
  title: {
    fontSize: 24,
    color: Colors.text,
    marginBottom: 20,
  },
  text: {
    
  }
});
