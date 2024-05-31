// AboutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  GITHUB_URL,
  PRIVACY_POLICY_URL,
  SCREEPER_URL,
  TERMS_AND_CONDITIONS_URL,
} from '../constants/app';
import { Colors } from '../constants/Colors';
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from 'expo-updates';
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AboutScreen() {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  const checkForUpdates = async () => {
    try {
      setIsUpdating(true);
      const update = await checkForUpdateAsync();
      if (update.isAvailable) {
        await fetchUpdateAsync();
        Alert.alert(t('app.updated.title'), t('app.updated.description'), [
          { text: t('ok'), onPress: async () => reloadAsync() },
        ]);
      } else {
        Toast.show({
          type: 'info',
          text1: t('app.uptodate.title'),
          text2: t('app.uptodate.description'),
          position: 'bottom',
          visibilityTime: 2000,
          bottomOffset: 45,
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: t('app.update.error.title'),
        text2: t('app.update.error.description'),
        visibilityTime: 2000,
        bottomOffset: 45,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.logoContainer}>
          <Pressable onPress={() => Linking.openURL(GITHUB_URL)}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
          </Pressable>
        </View>
        <Text style={styles.title}>FestivalPOS</Text>
        <Text style={styles.bodyText}>
          FestivalPOS was built for supporting the points of sale of the
          Aufgetischt St.Gallen and Buskers Chur Festivals by @screeper.
        </Text>
        <Pressable onPress={() => Linking.openURL(GITHUB_URL)}>
          <Text style={styles.link}>FestivalPOS GitHub page</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(SCREEPER_URL)}>
          <Text style={styles.link}>@screeper</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
          <Text style={styles.link}>Privacy policy</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(TERMS_AND_CONDITIONS_URL)}>
          <Text style={styles.link}>Terms & Conditions</Text>
        </Pressable>
      </ScrollView>
      <ActivityIndicator
        style={styles.activityIndicator}
        animating={isUpdating}
        size="small"
      />
      {Platform.OS !== 'web' && (
        <View style={styles.buttonContainer}>
          <Pressable onPress={checkForUpdates} style={styles.updateButton}>
            <Ionicons name="cloud-download-outline" size={20} color="white" />
            <Text style={styles.updateButtonText}>Check for updates</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
  },
  logoContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    margin: 20,
  },
  title: {
    fontSize: 22,
    marginVertical: 20,
    color: Colors.text,
  },
  bodyText: {
    color: Colors.text,
    marginBottom: 20,
  },
  link: {
    color: Colors.tint,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  activityIndicator: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  updateButton: {
    flex: 1,
    padding: 12,
    margin: 4,
    backgroundColor: 'darkgreen',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    color: Colors.tint,
    marginLeft: 10,
  },
});
