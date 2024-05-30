// AboutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
          {
            text: t('ok'),
            onPress: async () => reloadAsync(),
          },
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
      <ScrollView style={styles.body}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>FestivalPOS</Text>
          <Text style={styles.bodyText}>
            FestivalPOS was built for logistics management of the Aufgetischt
            and Buskers Chur Festivals by @screeper.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
            <Text style={styles.link}>Athena GitHub page</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(SCREEPER_URL)}>
            <Text style={styles.link}>@screeper</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
            <Text style={styles.link}>Privacy policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(TERMS_AND_CONDITIONS_URL)}
          >
            <Text style={styles.link}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.buttons}>
        {isUpdating ? (
          <ActivityIndicator size={'small'} />
        ) : (
          <Button onPress={checkForUpdates} title="Check for updates" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flex: 1, flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 22, color: Colors.text },
  container: {
    padding: 10,
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  bodyText: {
    color: Colors.text,
  },
  body: {
    flex: 1,
  },
  link: {
    color: 'blue',
    textDecorationColor: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  logo: {
    width: 104,
    height: 120,
    marginRight: 20,
    marginBottom: 20,
  },
  buttons: {
    width: '100%',
    paddingBottom: 20,
  },
});
