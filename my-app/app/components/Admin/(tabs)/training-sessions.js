import {
    View, Text, StatusBar, ImageBackground, StyleSheet, TouchableOpacity, FlatList,
    ScrollView
} from 'react-native';
import React, { useCallback } from 'react';
import Constants from 'expo-constants';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { useFocusEffect, useRouter } from 'expo-router';

export default function TrainingSessions() {
    const [trainingSessions, setTrainingSessions] = React.useState([]);
    const router = useRouter();

    const getTrainingSessions = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/availTrainer`);
            setTrainingSessions(data);
        } catch (error) {
            console.error("Error fetching training sessions:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getTrainingSessions();
        }, [])
    );

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../../../../assets/ProgramBG.png')}
                style={styles.backgroundImage}
                blurRadius={2}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.headerTitle}>Availed/Availing Sessions</Text>
                    <View style={styles.sessionContainer}>
                        <Text style={styles.sessionTitle}>PSP Training Sessions</Text>
                        <FlatList
                            style={{ height: 600 }}
                            data={trainingSessions}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => <SessionCard item={item} />}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const SessionCard = ({ item }) => {
    const router = useRouter();
    const navigateToSession = () => {
        router.push({
            pathname: '/components/Admin/components/view-training-session',
            params: { id: item._id }
        });
    };

    const statusColor = !item.coachID ? "blue" : item.status?.toLowerCase() === "active" ? "green" : "gray";
    const coachText = item.coachID ? item.coachID.name : "Assigned A Coach!!";

    return (
        <TouchableOpacity onPress={navigateToSession} activeOpacity={0.7}>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Text style={styles.cardText}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17, }}>
                            Client: {" "}
                        </Text>
                        {item?.userId?.name || "Unknown"}</Text>
                    <Text style={styles.cardText}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17, }}>
                            Coach:  {" "}
                        </Text>
                        {coachText}</Text>
                    <Text style={styles.cardText}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17, }}>
                            Package: {" "}
                        </Text>
                        {item?.package || "N/A"}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sessionContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        width: '90%',
        marginTop: 10,
        alignItems: 'center',
        elevation: 5, // Shadow effect
    },
    sessionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    card: {
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: 280,
    },
    cardContent: {
        flexDirection: 'column',
    },
    cardText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statusDot: {
        width: 15,
        height: 15,
        borderRadius: 50,
    },
});