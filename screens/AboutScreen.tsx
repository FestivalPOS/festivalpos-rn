// AboutScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    color: Colors.text,
    fontSize: 18,
  },
});
