import { StyleSheet, Text, View, Image, ScrollView, StatusBar, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import styles from '../styles/CompExerciseDetails';

const ExerciseDetails = ({ exercise, onClose }) => {
    const renderStars = (difficulty) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name={i <= difficulty ? 'star' : 'star-o'}
                    size={14}
                    color="#FFAC1C"
                />
            );
        }
        return stars;
    };

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80, paddingHorizontal: 20 }}>
                    <Image source={{ uri: exercise.image[0]?.url }} style={{ width: 172, height: 175, borderRadius: 10 }} />
                </View>
                <Animatable.View delay={200} animation="slideInRight">
                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginHorizontal: 16, height: 80, marginTop: 100 }}>
                        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>{exercise.name}</Text>
                    </View>
                </Animatable.View>
                <SafeAreaView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, height: 80, marginTop: 115 }}>
                        <Animatable.View delay={200} animation="slideInRight">
                            <View style={styles.starsContainer}>
                                {renderStars(exercise.difficulty)}
                            </View>
                            <Text style={{ marginTop: 5, fontWeight: 'bold', color: 'white' }}>Difficulty</Text>
                        </Animatable.View>
                        <Animatable.View delay={200} animation="slideInRight">
                            <View style={styles.detailContainer}>
                                <Text style={styles.exerciseInfoText}>{exercise.type}</Text>
                            </View>
                            <Text style={{ marginTop: 5, fontWeight: 'bold', color: 'white' }}>Type</Text>
                        </Animatable.View>
                        <Animatable.View delay={200} animation="slideInRight">
                            <View style={styles.detailContainer}>
                                <Text style={styles.exerciseInfoText}>{exercise.targetMuscle}</Text>
                            </View>
                            <Text style={{ marginTop: 5, fontWeight: 'bold', color: 'white' }}>Target</Text>
                        </Animatable.View>
                        <Animatable.View delay={200} animation="slideInRight">
                            <View style={styles.detailContainer}>
                                <Text style={styles.exerciseInfoText}>{exercise.equipmentUsed}</Text>
                            </View>
                            <Text style={{ marginTop: 5, fontWeight: 'bold', color: 'white' }}>Equipment</Text>
                        </Animatable.View>
                    </View>

                </SafeAreaView>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 20, marginTop:300 }}>
                <View style={{ marginRight: 10, justifyContent: 'flex-start' }}>
                    <Text style={{ fontSize: 15, color: 'white' }}>Instructions:</Text>
                </View>
                <Animatable.View delay={200} animation="slideInRight" style={{ flex: 1 }}>
                    <View style={styles.instructionContainer}>
                        <Text style={styles.instructionsText}>{exercise.instructions}</Text>
                    </View>
                </Animatable.View>
            </View>
        </>
    );
};

export default ExerciseDetails;
