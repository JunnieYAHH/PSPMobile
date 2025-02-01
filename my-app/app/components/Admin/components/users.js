import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

const Create = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            const fetchUsers = async () => {
                try {
                    const response = await axios.get(`${baseURL}/users/get-all-users`);
                    if (isMounted) {
                        // Filter out users with the 'admin' role
                        const nonAdminUsers = response.data.users.filter(user => user.role !== 'admin');
                        setUsers(nonAdminUsers);
                        setFilteredUsers(nonAdminUsers); // Show all non-admin users initially
                    }
                } catch (error) {
                    if (isMounted) {
                        console.error("Error fetching users:", error);
                    }
                }
            };

            fetchUsers();

            return () => {
                isMounted = false;
            };
        }, [])
    );

    // Function to filter users by role
    const filterUsersByRole = (role) => {
        const filtered = users.filter(user => user.role === role);
        setFilteredUsers(filtered);
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <AntDesign name="back" size={25} color='#FFAC1C' />
            </TouchableOpacity>

            {/* Side Navigation */}
            <View style={styles.sideNav}>
                <TouchableOpacity style={styles.button} onPress={() => filterUsersByRole('user')}>
                    <Text style={styles.buttonText}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => filterUsersByRole('client')}>
                    <Text style={styles.buttonText}>Clients</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => filterUsersByRole('coach')}>
                    <Text style={styles.buttonText}>Coaches</Text>
                </TouchableOpacity>
            </View>

            {/* Display Filtered Users */}
            <View style={styles.userListContainer}>
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <View>
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userRole}>{item.role}</Text>
                            </View>
                            <Text style={{ color: 'white', fontSize:13 }}>Hello</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default Create;

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', marginTop: 30 },
    backButton: { marginBottom: 30 },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    sideNav: {
        width: 100,
        paddingVertical: 20,
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    button: {
        backgroundColor: '#FFAC1C',
        paddingVertical: 10,
        marginBottom: 15,
        width: 70,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 12,
    },
    userListContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#DD571C',
        borderRadius: 30,
        marginLeft: 20,
        height:'70%'
    },
    userItem: {
        backgroundColor: '#2C2C2C',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    userName: {
        color: '#FFAC1C',
        fontSize: 13,
        fontWeight: 'bold',
    },
    userRole: {
        color: 'white',
        fontSize: 11,
        marginTop: 5,
    },
});
