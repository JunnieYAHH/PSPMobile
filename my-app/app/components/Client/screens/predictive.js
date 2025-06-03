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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Predicted Logs (Next 3 Days)</Text>
            <Text style={styles.subtext}>Estimated login counts based on historical usage patterns.</Text>
            {loading ? (
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
                            width={280}
                            height={250}
                            rulesColor="gray"
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                        {['Orange', 'Green', 'Red'].map((label, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
                                <View style={{ width: 10, height: 10, backgroundColor: ['#FFAC1C', '#00C897', '#FF6666'][i], marginRight: 4, borderRadius: 2 }} />
                                <Text style={{ color: 'white', fontSize: 12 }}>{label}</Text>
                            </View>
                        ))}
                    </View>
                </>

            ) : (
                <Text style={styles.noDataText}>No prediction data available</Text>
            )}
        </ScrollView>
    );
};

export default Predictive;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
    },
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
        width: 360,
        borderWidth: 1,
        borderColor: '#444',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 6,
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
