import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import Toast from 'react-native-toast-message';
import { Colors } from '../constants/Colors';
import { usePOS } from '../contexts/POS.context';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';

const QRScannerScreen = ({ navigation }) => {
  const { pos, updateURL } = usePOS();
  const { t } = useTranslation();
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log(data);
    setIsLoading(true);
    try {
      await updateURL(data);
      Toast.show({
        type: 'success',
        text1: t('screens.qrscanner.new_pos_loaded_successful'),
        position: 'bottom',
      });
      navigation.navigate('home', {
        screen: 'pos',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('screens.qrscanner.failed_to_load_pos'),
        text2: error.message,
        position: 'bottom',
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) {
    return <Text>{t('screens.qrscanner.requesting_camera_permission')}</Text>;
  }

  if (hasPermission === false) {
    return <Text>{t('screens.qrscanner.no_camera_access')}</Text>;
  }

  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color={Colors.tint} />
        <Text style={styles.loadingText}>
          {t('screens.qrscanner.processing')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.cameraContent}>
          <Pressable style={styles.button} onPress={() => navigation.goBack()}>
            <Ionicons name="close-circle-outline" size={20} color="white" />
            <Text style={styles.buttonText}>
              {t('screens.qrscanner.close_scanner')}
            </Text>
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    height: '100%',
    width: '100%',
  },
  cameraContent: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: Colors.tint,
    fontSize: 16,
    marginLeft: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text,
    fontSize: 16,
  },
});

export default QRScannerScreen;
