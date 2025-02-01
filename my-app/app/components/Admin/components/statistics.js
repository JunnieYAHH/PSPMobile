import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

const Statistics = ({ onBack }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <AntDesign name="back" size={20} color='#FFAC1C' />
            </TouchableOpacity>
            <Text style={styles.title}>Statistics</Text>
        </View>
    );
};

export default Statistics;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    backButton: { position: 'absolute', top: 40, left: 20, padding: 10, borderRadius: 5 },
    title: { fontSize: 24, fontWeight: 'bold' },
});