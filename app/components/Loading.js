import React from 'react';
import { ActivityIndicator, Text, StyleSheet, View } from 'react-native';

const Loading = () => (
    <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3e9ce9" />
        <Text style={styles.loadingText}>loading...</Text>
    </View>
);

const styles = StyleSheet.create({
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
    loadingText: {
        marginTop: 10,
        textAlign: 'center'
    }
});

export default Loading;