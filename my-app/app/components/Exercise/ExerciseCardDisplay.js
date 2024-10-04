import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/CompExerciseDisplay'

const ExerciseCardDisplay = ({ exercise, index }) => {
  const navigation = useNavigation();
  const imageUrl = exercise.image[0]?.url;
  const exerciseDifficulty = exercise.difficulty;

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
    <Animatable.View delay={index * 150} animation="slideInRight" style={styles.animatableView}>
      <View style={styles.card}>
        <View style={styles.content}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
            />
          )}
        </View>
        <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, marginTop: 8 }}>
          <Text style={{ textAlign: 'left', color: '#FFAC1C', fontWeight: 'bold', fontFamily: 'Roboto', fontSize: 17 }}>
            {exercise.name}
          </Text>
          <Text style={{ color: 'white', marginTop: 5, marginLeft: 10 }}>
            {exercise.instructions}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 3, marginLeft: 10 }}>
            <Text style={{ color: 'white' }}>
              Difficulty:
            </Text>
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
              {renderStars(exerciseDifficulty)}
            </View>
          </View>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('components/Exercise/ExerciseDetails', { exercise })}
            >
              <Text style={{ color: 'white' }}>Information</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animatable.View>
  );
};

export default ExerciseCardDisplay;
