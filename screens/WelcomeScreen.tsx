import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const WelcomeScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to FestivalPOS</Text>
            <Button
                title="Go to QR Scanner"
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
