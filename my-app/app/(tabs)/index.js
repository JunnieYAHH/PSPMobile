import { Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { useSelector } from "react-redux";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAllExercise } from '../(services)/api/getAllExercise';
import * as Animatable from 'react-native-animatable';
import ExerciseCardDisplay from '../../components/ExerciseCardDisplay';

const TabHome = () => {
  const [activeExercise, setActiveExercise] = useState('Bicep Curl')

  const { user } = useSelector((state) => state.auth);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchExercises = async () => {
      try {
        const data = await getAllExercise();
        // console.log(data.)
        if (isMounted) {
          setExercises(data.exercises);
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
  // console.log(exercises)

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.container}>
        {user ? (
          <>
            <ImageBackground
              source={require('../../assets/HomeBackground.png')}
              style={styles.backgroundImage}
              resizeMode='stretch'
            >
              <SafeAreaView style={styles.safeAreaView}>
                {/* Content Header */}
                <View style={styles.contentContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ color: 'white', marginRight: 10, fontWeight: 'bold', fontSize: 25 }}>
                      Welcome:
                    </Text>
                    <Text style={{ color: '#FFAC1C', fontSize: 20 }}>
                      {user.user.name}
                    </Text>
                  </View>
                  <View style={styles.imageContainer}>
                    {user && user.user && user.user.image && user.user.image.length > 0 ? (
                      <Image
                        style={styles.userImage}
                        source={{ uri: user.user.image[0].url }}
                      />
                    ) : (
                      <Text style={styles.text}>No image available</Text>
                    )}
                  </View>
                </View>

                {/* Header */}
                <View style={styles.headerContainer}>
                  <Text style={styles.headerText}>Philippines</Text>
                  <Text style={styles.headerText}>
                    <Text style={{ fontWeight: 'bold', color: '#FFAC1C' }}>Sports</Text> Performance
                  </Text>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                  <View style={styles.searchBox}>
                    <FontAwesome6 name="magnifying-glass" size={16} color="gray" style={{ marginTop: 6 }} />
                    <TextInput
                      placeholder='Search'
                      style={styles.searchInput}
                    />
                    <View style={styles.searchFilter}>
                      <MaterialIcons name="filter-list" size={24} color="black" style={{ marginLeft: 10 }} />
                    </View>
                  </View>
                </View>

                {/* ScrollView of Exercises */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollViewContent}
                  style={styles.scrollView}
                >
                  {exercises.map((exercise, index) => {
                    let isActive = exercise === activeExercise;
                    return (
                      <Animatable.View delay={index * 120} animation="slideInDown" key={index}>
                        <TouchableOpacity
                          key={exercise._id}
                          style={{ marginRight: 38 }}
                          onPress={() => setActiveExercise(exercise)}
                        >
                          <View style={{ alignItems: 'center' }}>
                            <Text
                              style={[
                                { color: 'white', fontSize: 16, letterSpacing: 1.5, marginTop: 20, marginLeft: 20},
                                isActive && styles.activeText,
                              ]}
                            >
                              {exercise.name}
                            </Text>
                          </View>
                          {isActive ? (
                            <View style={styles.customUnderline} />
                          ) : null}
                        </TouchableOpacity>
                      </Animatable.View>
                    );
                  })}
                </ScrollView>

                {/*Sample Exercises */}
                <ScrollView horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                  {
                    exercises.map((exercise, index) => <ExerciseCardDisplay exercise={exercise} index={index} key={index} />)
                  }
                </ScrollView>
              </SafeAreaView>
            </ImageBackground>
          </>
        ) : (
          <Text style={styles.text}>No user logged in</Text>
        )}
      </View>
    </>
  );
};

export default TabHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  safeAreaView: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginTop: 12,
    padding: 3,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  headerContainer: {
    marginHorizontal: 16,
    marginTop: 30,
  },
  headerText: {
    fontSize: 40,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 10,
  },
  searchContainer: {
    padding: 10,
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  searchInput: {
    marginLeft: 10,
    color: 'gray',
    fontSize: 16,
    flex: 1,
  },
  searchFilter: {
    backgroundColor: 'white',
    borderRadius: 15,
  },
  scrollView: {
    marginVertical: 6,
    paddingVertical: 6,
    maxHeight: 80,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    fontWeight: 'bold',
    color: 'white'
  },
  customUnderline: {
    height: 4,
    backgroundColor: '#FFAC1C',
    marginTop: 2,
    width: '80%',
    alignSelf: 'center',
    marginLeft:20
  },
});
