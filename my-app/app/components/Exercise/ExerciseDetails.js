import { StyleSheet, Text, View, Image, ScrollView, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import styles from '../styles/CompExerciseDetails'

const ExerciseDetails = () => {
    const route = useRoute();
    const { exercise } = route.params;
    const navigation = useNavigation();

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
    // console.log(exercise)

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />

            <View style={{
                flex: 1, backgroundColor: 'white', paddingTop: Constants.statusBarHeight
            }}>
                <Image style={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50, height: '45%', width: '100%', position: 'absolute' }} blurRadius={2} source={require('../../../assets/HomeBackground.png')} />
                <SafeAreaView>
                    <View>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="back" size={24} color="white" style={{ marginLeft: 20, fontWeight: 'bold', marginTop:10 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, paddingHorizontal: 20 }}>
                        <Image source={{ uri: exercise.image[0]?.url }} style={{ width: 172, height: 175, borderRadius: 10 }} />
                    </View>
                    <View style={{ marginTop: 100, marginLeft: 150 }}>
                        <Text style={{ color: 'white', fontSize: 24 }}>{exercise.name}</Text>
                    </View>
                </SafeAreaView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, height: 80, marginTop: 55 }}>
                    <Animatable.View delay={200} animation="slideInRight" >
                        <View style={styles.starsContainer}>
                            {renderStars(exercise.difficulty)}
                        </View>
                        <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
                            Difficulty
                        </Text>
                    </Animatable.View>
                    <Animatable.View delay={200} animation="slideInRight" >
                        <View style={styles.detailContainer}>
                            <Text>
                                {exercise.type}
                            </Text>
                        </View>
                        <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
                            Type
                        </Text>
                    </Animatable.View>
                    <Animatable.View delay={200} animation="slideInRight" >
                        <View style={styles.detailContainer}>
                            <Text>
                                {exercise.targetMuscle}
                            </Text>
                        </View>
                        <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
                            Target
                        </Text>
                    </Animatable.View>
                    <Animatable.View delay={200} animation="slideInRight" >
                        <View style={styles.detailContainer}>
                            <Text>
                                {exercise.equipmentUsed}
                            </Text>
                        </View>
                        <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
                            Equipment
                        </Text>
                    </Animatable.View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 30 }}>Instructions :</Text>
                    <Animatable.View delay={200} animation="slideInRight">
                        <View style={styles.instructionContainer}>
                            <Text style={styles.instructionsText}>
                                {exercise.instructions}
                            </Text>
                        </View>
                    </Animatable.View>
                </View>
            </View>
            <View>
                <Image
                    source={require('../../../assets/PSPAboutTabHome.jpg')}
                    style={styles.aboutImage}
                    resizeMode='cover'
                />
            </View>
        </>
    );
};

export default ExerciseDetails;