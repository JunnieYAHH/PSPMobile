import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { useSelector } from 'react-redux';

const History = () => {
    const user = useSelector((state) => state.auth)
    const [myLogs, setMyLogs] = useState([])
    const [branchNames, setBranchNames] = useState({}) // Store branch names
    const userId = user?.user?.user?._id || user?.user?._id

    const getMyLogs = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/logs/get-all-user-logs/${userId}`);
            setMyLogs(data.logs);
        } catch (error) {
            console.log(error)
        }
    }

    // Fetch branch name using adminBranchId
    const fetchBranchName = async (branchId) => {
        try {
            const { data } = await axios.get(`${baseURL}/branch/get-branch/${branchId}`);
            return data.branch?.name || 'Unknown Branch';
        } catch (error) {
            console.log(`Error fetching branch ${branchId}:`, error);
            return 'Unknown Branch';
        }
    };

    useEffect(() => {
        const fetchBranchNames = async () => {
            const newBranchNames = { ...branchNames };
            for (const log of myLogs) {
                if (!newBranchNames[log.adminBranchId]) { // Avoid duplicate requests
                    newBranchNames[log.adminBranchId] = await fetchBranchName(log.adminBranchId);
                }
            }
            setBranchNames(newBranchNames);
        };

        if (myLogs.length > 0) {
            fetchBranchNames();
        }
    }, [myLogs]);

    useFocusEffect(
        useCallback(() => {
            getMyLogs();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>History</Text>
            {myLogs.length === 0 ? (
                <Text style={styles.noLogs}>No logs available</Text>
            ) : (
                <FlatList
                    data={myLogs}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.logItem}>
                            <View style={styles.logHeader}>
                                {/* Profile Image */}
                                <Image
                                    source={{ uri: user.user.user.image[0].url }}
                                    style={styles.profileImage}
                                />

                                {/* Log Info */}
                                <View style={styles.logDetails}>
                                    <Text style={styles.text}>
                                        📅 Date: {new Date(item.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </Text>
                                    <Text style={styles.text}>
                                        ⏳ Time In: {item.timeIn
                                            ? new Date(item.timeIn).toLocaleTimeString("en-US", {
                                                timeZone: "UTC",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })
                                            : 'Still Active'}
                                    </Text>
                                    <Text style={styles.text}>
                                        ⏳ Time Out: {item.timeOut
                                            ? new Date(item.timeOut).toLocaleTimeString("en-US", {
                                                timeZone: "UTC",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })
                                            : 'Still Active'}
                                    </Text>
                                    <Text style={styles.text}>
                                        📍 Branch: {branchNames[item.adminBranchId] || 'Loading...'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

export default History

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        backgroundColor: '#FFAC1C',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'center',
    },
    noLogs: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        marginTop: 20,
    },
    logItem: {
        backgroundColor: '#2A2A2A',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    logHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#FFAC1C',
    },
    logDetails: {
        flex: 1,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 3,
    },
})
