import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import Toast from 'react-native-toast-message';
import { usePOS } from '../contexts/POS.context';

const SettingsScreen = ({ navigation }) => {
  const { pos, loading, updateURL, refreshProducts } = usePOS();  // Use updateURL from context
  const [url, setUrl] = useState(pos.url);  // State to hold URL input

  useEffect(() => {
    // Initialize URL input with the current URL from context
    if (pos.url) {
      setUrl(pos.url);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Please scan a FestivalPOS QR Code first',
        text2: 'This is needed to get data for the POS',
        position: 'bottom'
      });
    }
  }, [pos.url]);

  const saveUrl = async () => {
    if (!url) {
      Toast.show({
        type: 'error',
        text1: 'URL cannot be empty',
        position: 'bottom'
      });
      return;
    }

    try {
      await updateURL(url);
      Toast.show({
        type: 'success',
        text1: 'POS URL saved successfully',
        position: 'bottom'
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Could not save POS URL',
        text2: error.message,
        position: 'bottom'
      })
    }
  };

  const reloadProducts = async () => {
    try {
      await refreshProducts();
      Toast.show({
        type: 'success',
        text1: 'Products refreshed',
        position: 'bottom'
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Could not refresh products',
        text2: error.message,
        position: 'bottom'
      })
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.icon} />
      ) : (
        <View>
          {pos.name.length > 0 ?? ( <View style={styles.box}><Text style={styles.pos}>Current POS: {pos.name}</Text></View> )}
          <View style={styles.box}>
            <Pressable style={styles.button} onPress={() => navigation.navigate('QRScanner')}>
              <Text style={styles.buttonText}>Scan QR Code</Text>
            </Pressable>
            {pos.name.length > 0 ?? ( 
            <Pressable style={styles.button} onPress={reloadProducts}>
              <Text style={styles.buttonText}>Refresh Products</Text>
            </Pressable>
            )}
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Enter URL"
              placeholderTextColor={Colors.icon}
              value={url}
              onChangeText={setUrl}
            />
            <Pressable style={styles.button} onPress={saveUrl}>
              <Text style={styles.buttonText}>Save URL</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pos: {
    color: Colors.text,
    fontSize: 16,
  },
  input: {
    height: 40,
    width: 300,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.icon,
    padding: 10,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.tint,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.background,
    textAlign: 'center',
  }
});

export default SettingsScreen;
