// AboutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Button,
  Linking,
  Alert,
  Image,
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
          text1: t('app.uptodate.title'),
          text2: t('app.uptodate.description'),
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: t('app.update.error.title'),
        text2: t('app.update.error.description'),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Pressable onPress={() => Linking.openURL(GITHUB_URL)}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </Pressable>
        <Text style={styles.title}>FestivalPOS</Text>
        <Text style={styles.bodyText}>
          FestivalPOS was built for logistics management of the Aufgetischt and
          Buskers Chur Festivals by @screeper.
        </Text>
        <Pressable onPress={() => Linking.openURL(GITHUB_URL)}>
          <Text style={styles.link}>Athena GitHub page</Text>
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
      <View>
        <Pressable onPress={checkForUpdates} style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Check for updates</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
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
  },
  link: {
    color: Colors.tint,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  activityIndicator: {
    marginVertical: 20,
  },
  updateButton: {
    margin: 10,
    padding: 10,
    backgroundColor: Colors.buttonBackground,
    borderRadius: 4,
    width: '90%',
    alignItems: 'center',
  },
  updateButtonText: {
    color: Colors.tint,
  },
});
