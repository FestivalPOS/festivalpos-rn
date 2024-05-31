import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Colors } from '../constants/Colors';
import Toast from 'react-native-toast-message';
import { usePOS } from '../contexts/POS.context';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';

const SettingsScreen = ({ navigation }) => {
  const { pos, loading, updateURL, refreshProducts } = usePOS(); // Use updateURL from context
  const [url, setUrl] = useState(pos.url); // State to hold URL input
  const { t } = useTranslation();

  useEffect(() => {
    // Initialize URL input with the current URL from context
    if (pos.url) {
      setUrl(pos.url);
    } else {
      Toast.show({
        type: 'info',
        text1: t('screens.settings.scan_qr_first'),
        text2: t('screens.settings.needed_for_pos_data'),
        position: 'bottom',
      });
    }
  }, [pos.url]);

  const saveUrl = async () => {
    if (!url) {
      Toast.show({
        type: 'error',
        text1: t('screens.settings.url_cannot_be_empty'),
        position: 'bottom',
      });
      return;
    }

    try {
      await updateURL(url);
      Toast.show({
        type: 'success',
        text1: t('screens.settings.pos_url_saved'),
        position: 'bottom',
      });
      navigation.navigate('POS');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('screens.settings.pos_url_not_saved'),
        text2: t(error.message),
        position: 'bottom',
      });
    }
  };

  const reloadProducts = async () => {
    try {
      await refreshProducts();
      Toast.show({
        type: 'success',
        text1: t('screens.settings.products_refreshed'),
        position: 'bottom',
      });
      navigation.navigate('home', { screen: 'pos' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('screens.settings.products_not_refreshed'),
        text2: t(error.message),
        position: 'bottom',
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.icon} />
      ) : (
        <View>
          {pos.name.length > 0 && (
            <View style={styles.box}>
              <Text style={styles.pos}>
                {t('screens.settings.current_pos')}: {pos.name}
              </Text>
            </View>
          )}
          <View style={styles.box}>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate('qr-scanner')}
            >
              <Ionicons name="qr-code-outline" size={20} color="white" />
              <Text style={styles.buttonText}>
                {t('screens.settings.scan_qr_code')}
              </Text>
            </Pressable>
            {pos.name.length > 0 && (
              <Pressable style={styles.button} onPress={reloadProducts}>
                <Ionicons name="refresh-outline" size={20} color="white" />
                <Text style={styles.buttonText}>
                  {t('screens.settings.refresh_products')}
                </Text>
              </Pressable>
            )}
          </View>
          {Platform.OS === 'web' && (
            <View>
              <TextInput
                style={styles.input}
                placeholder={t('screens.settings.enter_url_manually')}
                placeholderTextColor={Colors.icon}
                value={url}
                onChangeText={setUrl}
              />
              <Pressable style={styles.button} onPress={saveUrl}>
                <Text style={styles.buttonText}>
                  {t('screens.settings.save_url')}
                </Text>
              </Pressable>
            </View>
          )}
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
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    flexWrap: 'wrap',
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
    width: 500,
    maxWidth: '95%',
    marginVertical: 20,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.icon,
    padding: 10,
    color: Colors.text,
  },
  button: {
    flex: 1,
    minWidth: 180,
    padding: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.text,
    textAlign: 'center',
    marginLeft: 10,
  },
});

export default SettingsScreen;
