import { Image, ImageBackground, StatusBar, StyleSheet, Text, View, TouchableOpacity, Animated, FlatList, ScrollView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { getAllExercise } from '../(services)/api/getAllExercise';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Programs = () => {
  const [scale] = useState(new Animated.Value(1));
  const [selectedView, setSelectedView] = useState('exercise');

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
        source={require('../../assets/ProgramBG.png')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 1.5 }}
        blurRadius={2}
        resizeMode="stretch"
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Image
              source={require('../../assets/ProgramHeader.jpg')}
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

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  card: {
    width: 400,
    height: 200,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  textCard: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginLeft: 15,
  },
  imageContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arnoldImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 15,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  filterBackground: {
    backgroundColor: '#FFAC1C',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  checkbox: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  checkboxSelected: {
    backgroundColor: '#FFAC1C',
  },
  checkboxText: {
    fontSize: 16,
    color: 'black',
  },
  exerciseCard: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  exerciseImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  exerciseInfoContainer: {
    marginTop: 10,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseDetails: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  instructionsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFAC1C',
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  exerciseInstructions: {
    fontSize: 14,
    color: 'white',
  },
  bmiContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 15,
  },
  calculateButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },  
});
