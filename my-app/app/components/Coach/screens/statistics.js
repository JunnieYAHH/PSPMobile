import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { useSelector } from 'react-redux';
import { BarChart, PieChart } from 'react-native-gifted-charts';

const Statistics = () => {
    const [ratings, setRatings] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const userId = user.user?._id;

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const { data } = await axios.get(`${baseURL}/users/get-ratings/${userId}`);
                setRatings(data.ratings);
            } catch (error) {
                console.log('Error fetching ratings:', error);
            }
        };
        fetchRatings();
    }, []);

    // Count occurrences of each rating (1 to 5)
    const ratingCounts = ratings.reduce((acc, item) => {
        acc[item.rating] = (acc[item.rating] || 0) + 1;
        return acc;
    }, {});

    // Convert data for Bar Chart
    const barChartData = Object.keys(ratingCounts).map((key) => ({
        value: ratingCounts[key],
        label: key, // Rating number (1-5)
        frontColor: getColorForRating(key),
    }));

    // Convert data for Pie Chart
    const pieChartData = Object.keys(ratingCounts).map((key) => ({
        value: ratingCounts[key],
        color: getColorForRating(key),
        text: `${key} (${ratingCounts[key]})`, // Label with count
    }));

    // Function to assign colors based on rating
    function getColorForRating(rating) {
        const colors = {
            1: '#FF3B30', // Red for 1 star
            2: '#FF9500', // Orange for 2 stars
            3: '#FFD60A', // Yellow for 3 stars
            4: '#4CD964', // Green for 4 stars
            5: '#007AFF', // Blue for 5 stars
        };
        return colors[rating] || '#ccc'; // Default color
    }

    // Emoji Sentiment Map
    const emojiSentimentMap = {
        "😊": 5,
        "😀": 4,
        "😐": 3,
        "😞": 2,
        "😡": 1
    };

    // Determine the most common rating
    const highestRating = Object.keys(ratingCounts).reduce((a, b) => ratingCounts[a] > ratingCounts[b] ? a : b, 1);
    
    // Get the corresponding emoji
    const highestEmoji = Object.keys(emojiSentimentMap).find(emoji => emojiSentimentMap[emoji] == highestRating);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sentiment Analysis</Text>

            {ratings.length > 0 ? (
                <>
                    {/* Sentiment Summary */}
                    <View style={styles.sentimentContainer}>
                        <Text style={styles.sentimentText}>
                            Most Common Rating: <Text style={styles.ratingNumber}>{highestRating}</Text> {highestEmoji}
                        </Text>
                    </View>

                    {/* Bar Chart */}
                    <Text style={styles.chartTitle}>Rating Distribution</Text>
                    <BarChart
                        data={barChartData}
                        barWidth={30}
                        spacing={20}
                        roundedTop
                        roundedBottom
                        hideRules
                        yAxisThickness={0}
                        xAxisThickness={2}
                    />

                    {/* Pie Chart */}
                    <Text style={styles.chartTitle}>Rating Breakdown</Text>
                    <PieChart
                        data={pieChartData}
                        donut
                        showText
                        radius={100}
                        innerRadius={50}
                        textSize={14}
                        textColor="black"
                    />
                </>
            ) : (
                <Text style={styles.noDataText}>No ratings available</Text>
            )}
        </View>
    );
};

export default Statistics;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sentimentContainer: {
        backgroundColor: '#E3F2FD',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    sentimentText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    ratingNumber: {
        color: '#007AFF',
        fontSize: 20,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    noDataText: {
        fontSize: 16,
        color: 'gray',
    },
});