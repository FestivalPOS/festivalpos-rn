import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTranslation } from 'react-i18next';

const WelcomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('welcome_to_festivalpos')}</Text>
            <Button
                title={t('screens.welcome.go_to_qrscanner')}
                onPress={() => navigation.navigate('QRScanner')}
                color="#1E90FF"
            />
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
    }
});

export default WelcomeScreen;
