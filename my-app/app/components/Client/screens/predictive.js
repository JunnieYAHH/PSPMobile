import { StyleSheet, Text, View, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart } from 'react-native-gifted-charts';
import baseURL from '../../../../assets/common/baseUrl';

const screenWidth = Dimensions.get('window').width;

const Predictive = () => {
    const [predictionLogs, setPredictiveLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const res = await axios.get(`${baseURL}/ml/logs-prediction`);
                setPredictiveLogs(res.data);
                setLoading(false);
            } catch (err) {
                // console.error('Error fetching prediction logs:', err);
                setLoading(false);
            }
        };

        fetchPrediction();
    }, []);

    const formattedPredictionData = predictionLogs.map((log, index) => {
        const dateObj = new Date(log.date);
        const label = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }); // e.g., "Jun 3"

        return {
            value: Math.round(log.predicted_logins),
            label,
            frontColor: ['#FFAC1C', '#00C897', '#FF6666'][index % 3],
        };
    });


    const maxY = Math.max(...formattedPredictionData.map(d => d.value), 1);
    const steps = 4;
    const stepSize = Math.ceil(maxY / steps);
    const roundedMax = steps * stepSize;

    const yAxisLabelTexts = Array.from({ length: steps + 1 }, (_, i) => String(i * stepSize));

    return (
        <View style={{ marginTop: 20, }}>
            <Text style={styles.title}>Predicted Logs (Next 3 Days)</Text>
            <Text style={styles.subtext}>Estimated login counts based on historical usage patterns.</Text>
            {
                loading ? (
                    <ActivityIndicator size="large" color="#FFAC1C" style={styles.loadingIndicator} />
                ) : formattedPredictionData.length > 0 ? (
                    <>
                        <View style={styles.chartContainer}>
                            <LineChart
                                data={formattedPredictionData}
                                thickness={3}
                                hideDataPoints={false}
                                isAnimated
                                xAxisLabelTextStyle={{ color: 'white', fontWeight: 'bold' }}
                                yAxisTextStyle={{ color: 'white', fontWeight: 'bold' }}
                                yAxisLabelTexts={yAxisLabelTexts}
                                yAxisLabelWidth={35}
                                noOfSections={steps}
                                maxValue={roundedMax}
                                areaChart
                                curved
                                width={150}
                                height={100}
                                rulesColor="gray"
                            />
                        </View>
                    </>

                ) : (
                    <Text style={styles.noDataText}>No prediction data available</Text>
                )
            }
        </View>
    );
};

export default Predictive;

const styles = StyleSheet.create({
    title: {
        color: '#FFAC1C',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#FFAC1C',
        paddingBottom: 5,
        width: '100%',
    },

    subtext: {
        color: '#CCCCCC',
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
        width: '90%',
    },
    chartContainer: {
        backgroundColor: '#2C2C2C',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        shadowColor: '#000',
        width: 250,
        borderWidth: 1,
        borderColor: '#444',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 6,
        marginLeft: 70,
    },
    loadingIndicator: {
        marginTop: 50,
    },
    noDataText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 30,
    },
});
