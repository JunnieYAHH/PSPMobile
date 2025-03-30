import React, { useState, useEffect, useCallback } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, FlatList } from 'react-native';
import Constants from 'expo-constants';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { LineChart } from 'react-native-gifted-charts';
import { useFocusEffect } from '@react-navigation/native';
import baseURL from '../../../../assets/common/baseUrl';

const Progress = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [myProgress, setMyProgress] = useState([]);
    const user = useSelector((state) => state.auth.user.user);
    const userId = user?._id || user?.user?._id;

    const fetchMyProgress = async () => {
        try {
            const response = await axios.get(`${baseURL}/users/get-user/${userId}`);
            setMyProgress(response.data.user.progress);
        } catch (error) {
            console.error('Progress fetch failed:', error.response?.data?.message || error.message);
            Alert.alert(
                'Fetch Progress Failed',
                error.response?.data?.message || 'An error occurred while fetching your progress. Please try again.'
            );
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMyProgress();
        }, [userId])
    );

    const transformDataForChart = () => {
        return myProgress.map(entry => ({
            value: parseFloat(entry.kilogram),
            label: new Date(entry.date).toLocaleDateString('en-US', {
                month: 'long',
                day: '2-digit',
            }),
        }));
    };

    const renderItem = ({ item }) => (
        <View style={styles.progressItem}>
            <Text style={styles.progressDate}>
                Date: {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: '2-digit',
                    year: 'numeric',
                })}
            </Text>
            <Text style={styles.progressWeight}>Weight: {item.kilogram} kg</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Progress</Text>
            <Formik
                initialValues={{ kilogram: '' }}
                onSubmit={async (values) => {
                    setIsLoading(true);
                    try {
                        await axios.post(`${baseURL}/users/progress-input/${userId}`, values);
                        fetchMyProgress();
                    } catch (error) {
                        console.error('Progress input failed:', error.response?.data?.message || error.message);
                        Alert.alert(
                            'Input Failed',
                            error.response?.data?.message || 'An error occurred while submitting your progress. Please try again.'
                        );
                    } finally {
                        setIsLoading(false);
                    }
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Input Your Current Weight in kg"
                                onChangeText={handleChange('kilogram')}
                                onBlur={handleBlur('kilogram')}
                                value={values.kilogram}
                                keyboardType="numeric"
                            />
                            {errors.kilogram && touched.kilogram && (
                                <Text style={styles.errorText}>{errors.kilogram}</Text>
                            )}
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>{isLoading ? 'Recording...' : 'Record'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
            <View style={{ backgroundColor: '#FFAC1C', padding: 8, borderRadius: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center', marginBottom: 10, marginTop: 3, fontSize: 20 }}>Progress Statistic</Text>
                <View style={styles.chartContainer}>
                    {myProgress.length > 0 ? (
                        <LineChart
                            data={transformDataForChart()}
                            height={200}
                            width={250}
                            color="skyblue"
                            dataPointsColor="blue"
                            showValuesAsDataPointsText
                            showVerticalLines
                            textColor="green"
                            spacing={60}
                            textFontSize={13}
                            textShiftY={-2}
                            textShiftX={-5}
                        />
                    ) : (
                        <Text style={styles.noDataText}>No progress data available.</Text>
                    )}
                </View>

                <FlatList
                    data={myProgress}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.progressList}
                />
            </View>
        </View>
    );
};

export default Progress;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#353839',
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
        textAlign: 'center'
    },
    form: {
        marginBottom: 24,
    },
    inputContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    button: {
        height: 35,
        backgroundColor: '#6200ea',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        width: '50%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    chartContainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20
    },
    noDataText: {
        color: '#fff',
        fontSize: 16,
    },
    progressList: {
        paddingVertical: 16,
    },
    progressItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    progressDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    progressWeight: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});