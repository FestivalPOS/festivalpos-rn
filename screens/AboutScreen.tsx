// AboutScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About bla bla</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20
  },
  title: {
    fontSize: 24,
    color: Colors.text,
    marginBottom: 20,
  },
});
