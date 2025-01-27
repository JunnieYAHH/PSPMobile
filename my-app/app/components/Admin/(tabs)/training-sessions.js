import { View, Text, StatusBar, ImageBackground, StyleSheet, Pressable, TouchableOpacity, FlatList } from 'react-native'
import React, { useCallback } from 'react'
import Constants from 'expo-constants';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { ScrollView } from 'react-native-gesture-handler';
import { router, useFocusEffect, useRouter } from 'expo-router';

export default function TrainingSessions() {

    const [trainingSessions, setTrainingSessions] = React.useState([]);

    const getTrainingSessions = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/availTrainer`)

            setTrainingSessions(data);

        } catch (error) {
            console.error("Error fetching training sessions:", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            getTrainingSessions();
        }, [])
    )

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../../../../assets/ProgramBG.png')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 2.0 }}
                blurRadius={2}
                resizeMode="cover"
            >
                <View style={styles.overlay}>

                    <View style={{ padding: 10, }}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, }}>
                            <Text style={{
                                fontSize: 30,
                                color: '#FFAC1C',
                                fontStyle: 'italic',
                            }}>
                                PSP
                            </Text>
                            <Text style={{
                                color: 'white',
                                fontSize: 30,
                                fontStyle: 'italic',
                            }}>Training Sessions</Text>
                        </View>
                        <Text style={{
                            color: 'white', textAlign: 'right', fontSize: 30,
                            fontStyle: 'italic',
                        }}>
                            Availed / Availing
                        </Text>
                    </View>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ marginTop: 5, maxHeight: 530, }}>
                            <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 2, backgroundColor: '#FFAC1C', padding: 10, }}>
                                <Text style={{ color: 'white', fontSize: 18, width: 120, }}>Client</Text>
                                <Text style={{ color: 'white', fontSize: 18, width: 120, paddingHorizontal: 10, }}>Coach</Text>
                                <Text style={{ color: 'white', fontSize: 18, width: 120, paddingHorizontal: 10, }}>Package</Text>
                                <Text style={{ color: 'white', fontSize: 18, paddingHorizontal: 10, }}>Status</Text>
                            </View>

                            <FlatList
                                data={trainingSessions}
                                keyExtractor={item => item._id}
                                renderItem={({ item }) => <SessionsList item={item} />}
                            />
                        </View>
                    </ScrollView>
                </View>

            </ImageBackground>
        </View>
    )
}

const SessionsList = ({ item }) => {

    const router = useRouter()

    const gotoSingleSession = () => {
        router.push({
            pathname: '/components/Admin/components/view-training-session',
            params: { id: item._id }
        });
    }

    return (
        <TouchableOpacity onPress={gotoSingleSession}>
            <View style={{ display: 'flex', flexDirection: 'row', padding: 10, }}>
                <Text style={{ color: 'white', fontSize: 18, width: 120 }}>{item.userId.name}</Text>
                <Text style={{ color: 'white', fontSize: 18, width: 120, paddingHorizontal: 10, }}>{item?.coachID?.name || "Please Assign"}</Text>
                <Text style={{ color: 'white', fontSize: 18, width: 120, paddingHorizontal: 10, }}>{item.package}</Text>
                <Text style={{ color: 'white', fontSize: 18, paddingHorizontal: 10, }}>{item?.status}</Text>
            </View>
            <View
                style={{
                    borderBottomColor: 'white',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
        </TouchableOpacity>
    )
}

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
        marginTop: 10,
        // padding: 15,
    },
    dashboardContainer: {
        flexDirection: 'column',
    },
    pspText: {
        fontSize: 50,
        color: '#FFAC1C',
        fontStyle: 'italic',
        transform: [{ skewX: '-10deg' }],
    },
    dashboardText: {
        fontSize: 40,
        color: 'white',
        fontStyle: 'italic',
        transform: [{ skewX: '-10deg' }],
    },
});
