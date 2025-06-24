import { ImageBackground, StatusBar, StyleSheet, Text, View, FlatList, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import Constants from 'expo-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import { getTimedInLogs } from '../../../(services)/api/Users/getTimedInLogs';
import { getAllUsers } from '../../../(services)/api/Users/getAllUsers';
import { useSelector } from 'react-redux';

const UserLogs = () => {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const [activeLogs, setActiveLogs] = useState([]);
    const userBranch = user?.user?.userBranch
    const getActiveLogs = async () => {
        try {
            const logData = await getTimedInLogs({ userBranch });
            const users = await getAllUsers();

            if (!users || !Array.isArray(users)) {
                console.error("Users data is invalid:", users);
                return;
            }

            // Check if there are active logs
            if (!logData.activeLogs || logData.activeLogs.length === 0) {
                setActiveLogs([]);
                return; // Optionally, you can set a state to indicate "0 users" and show it in the UI
            }

            const logsWithUserDetails = (Array.isArray(logData.activeLogs) ? logData.activeLogs : [logData.activeLogs]).map(log => {
                // Ensure log has a valid userId
                if (!log.userId) {
                    console.warn("Invalid log entry with missing userId:", log);
                    return {
                        ...log,
                        userId: "Unknown ID",
                        userName: "Unknown User",
                        userImage: null,
                        timeInFormatted: log.timeIn ? new Date(log.timeIn).toLocaleString() : "N/A",
                        timeOutFormatted: log.timeOut ? new Date(log.timeOut).toLocaleString() : "Active",
                    };
                }

                const user = users.find(u => u._id === log.userId);
                return {
                    ...log,
                    userId: user ? user._id : "Unknown ID",
                    userName: user ? user.name : "Unknown User",
                    userImage: user && user.image.length > 0 ? user.image[0].url : null,
                    timeInFormatted: log.timeIn ? new Date(log.timeIn).toLocaleString() : "N/A",
                    timeOutFormatted: log.timeOut ? new Date(log.timeOut).toLocaleString() : "Active",
                };
            });

            // console.log(logData, 'Logs Data')
            setActiveLogs(logsWithUserDetails);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    console.log(activeLogs, 'Active lgos')

    useFocusEffect(
        useCallback(() => {
            getActiveLogs();
        }, [])
    );

    const renderLogItem = ({ item }) => {
        // Format the date and time values
        const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });

        const formattedTimeIn = new Date(item.timeIn).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

        const formattedTimeOut = item.timeOut
            ? new Date(item.timeOut).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            })
            : "Active";

        return (
            <View style={styles.row}>
                {/* User Name */}
                {item.userImage && (
                    <Image
                        source={{ uri: item.userImage }}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                )}
                <Text style={{
                    flex: 1,
                    color: 'white',
                    fontSize: 14,
                    marginLeft: 23,
                }}>{item.userName}</Text>

                {/* Date */}
                <Text style={styles.cell}>{formattedDate}</Text>

                {/* Time In */}
                <Text style={styles.cell}>{formattedTimeIn}</Text>

                {/* Time Out */}
                <Text style={styles.cell}>{formattedTimeOut}</Text>
            </View>
        );
    };

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
                    <View style={styles.dashboardContainer}>
                        <Text style={styles.pspText}>PSP <Text style={styles.dashboardText}>Logs</Text></Text>
                    </View>

                    {/* Table Headers */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerCell}></Text>
                        <Text style={styles.headerCell}>User</Text>
                        <Text style={styles.headerCell}>Date</Text>
                        <Text style={styles.headerCell}>Time In</Text>
                        <Text style={styles.headerCell}></Text>
                    </View>

                    {/* Table Rows */}
                    {activeLogs.length === 0 ? (
                        <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>
                            0 users in the gym
                        </Text>
                    ) : (
                        <FlatList
                            data={activeLogs}
                            renderItem={renderLogItem}
                            keyExtractor={(item) => item._id}
                        />
                    )}
                </View>
            </ImageBackground>
        </View>
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
        marginTop: 40,
        padding: 16,
    },
    dashboardContainer: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    pspText: {
        fontSize: 50,
        color: '#FFAC1C',
        fontStyle: 'italic',
        transform: [{ skewX: '-10deg' }],
    },
    dashboardText: {
        fontSize: 50,
        color: 'white',
        fontStyle: 'italic',
        transform: [{ skewX: '-10deg' }],
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#FFAC1C',
        paddingBottom: 5,
        marginBottom: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color: '#FFAC1C',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    cell: {
        flex: 1,
        color: 'white',
        fontSize: 14,
    },
})

export default UserLogs;
