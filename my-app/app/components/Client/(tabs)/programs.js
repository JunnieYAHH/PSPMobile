import { Image, ImageBackground, StatusBar, StyleSheet, Text, View, TouchableOpacity, Animated, FlatList, ScrollView, TextInput } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Constants from 'expo-constants';
import { getAllExercise } from '../../../(services)/api/Exercises/getAllExercise';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import styles from '../../styles/TabProgramStyles';
import SubscriptionReminder from '../components/SubscriptionReminder';
import { useSelector } from 'react-redux';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { useFocusEffect } from 'expo-router';

const Programs = () => {
  const [scale] = useState(new Animated.Value(1));
  const [selectedView, setSelectedView] = useState('exercise');
  const { user } = useSelector((state) => state.auth);
  const [membershipExpiration, setMembershipExpiration] = useState({})

  const getUser = async () => {
    try {
      const data = await axios.get(`${baseURL}/users/get-user/${user?._id || user?.user?._id}`)
      // console.log(data.data.user,'Data')
      setMembershipExpiration(data.data.user.subscriptionExpiration)
    } catch (error) {
      console.log('Frontend Index Error', error.message)
    }
  }
  useFocusEffect(
    useCallback(() => {
      if (user?._id || user?.user?._id) {
        getUser();
        const interval = setInterval(() => {
          getUser();
        }, 3000);
        return () => clearInterval(interval);
      }
    }, [user?._id || user?.user?._id])
  );

  const handlePress = (view) => {
    Animated.timing(scale, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();

      setSelectedView(view);
    });
  };

  // Filter
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchExercises = async () => {
      try {
        const data = await getAllExercise();
        if (isMounted) {
          setExercises(data.exercises);
          setFilteredExercises(data.exercises); // Initially show all exercises
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching exercises:", error);
        }
      }
    };
    fetchExercises();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filters
  const [selectedFilters, setSelectedFilters] = useState([]);
  const filterOptions = [
    'Chest',
    'Shoulder',
    'Triceps',
    'Back',
    'Legs',
    'Biceps',
    'Core',
  ];

  const handleFilterSelect = (filter) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter((item) => item !== filter)
      : [...selectedFilters, filter];

    setSelectedFilters(newFilters);

    // Update filtered exercises based on selected filters
    if (newFilters.length > 0) {
      setFilteredExercises(exercises.filter(exercise => newFilters.includes(exercise.targetMuscle)));
    } else {
      setFilteredExercises(exercises);
    }
  };

  //BMI CALCULATOR
  // Inside your Programs component
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiMessage, setBmiMessage] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmiValue = (w / (h * h)).toFixed(2);
      setBmi(bmiValue);
      if (bmiValue < 18.5) {
        setBmiMessage('Underweight');
      } else if (bmiValue < 24.9) {
        setBmiMessage('Normal weight');
      } else if (bmiValue < 29.9) {
        setBmiMessage('Overweight');
      } else {
        setBmiMessage('Obesity');
      }
    } else {
      alert('Please enter valid weight and height.');
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../../../assets/ProgramBG.png')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 2.0 }}
        blurRadius={2}
        resizeMode="cover"
      >
        <SubscriptionReminder expirationDate={membershipExpiration} userId={user?._id || user?.user?._id} />
        <View style={styles.container}>
          <View style={styles.card}>
            <Image
              source={require('../../../../assets/ProgramHeader.jpg')}
              style={styles.image}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePress('exercise')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Exercise Programs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePress('BMI')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>BMI Calculator</Text>
            </TouchableOpacity>
          </View>

          {selectedView === 'exercise' && (
            <View>
              {/* Filter Exercise Programs */}
              <View style={styles.filterContainer}>
                <View style={styles.filterBackground}>
                  <Text style={{ fontSize: 27, color: 'black' }}>Filter
                    <MaterialIcons name="filter-list" size={24} color="black" style={{ marginLeft: 10 }} />
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filterOptions.map((filter) => (
                      <TouchableOpacity
                        key={filter}
                        style={[
                          styles.checkbox,
                          selectedFilters.includes(filter) && styles.checkboxSelected,
                        ]}
                        onPress={() => handleFilterSelect(filter)}
                      >
                        <Text style={styles.checkboxText}>{filter}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              {/* Render filtered exercises */}
              <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.exerciseCard}>
                    <Image source={{ uri: item.image[0]?.url }} style={styles.exerciseImage} />
                    <View style={styles.exerciseInfoContainer}>
                      <Text style={styles.exerciseName}>{item.name}</Text>
                      <Text style={styles.exerciseDetails}>Target Muscle: {item.targetMuscle}</Text>
                    </View>
                    <View style={styles.instructionsContainer}>
                      <Text style={styles.instructionsTitle}>Instructions:</Text>
                      <Text style={styles.exerciseInstructions}>{item.instructions}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}

          {selectedView === 'BMI' && (
            <View style={styles.bmiContainer}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, color: 'white' }}>BMI CALCULATOR</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter height (cm)"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
                <Text style={styles.buttonText}>Calculate BMI</Text>
              </TouchableOpacity>
              {bmi && (
                <Text style={{ fontSize: 20, color: 'white' }}>Your BMI: {bmi} - {bmiMessage}</Text>
              )}
            </View>
          )}
        </View>
      </ImageBackground>
    </>
  );
};

export default Programs;