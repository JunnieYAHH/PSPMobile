import { Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { useSelector } from "react-redux";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAllExercise } from '../(services)/api/getAllExercise';
import ExerciseCardDisplay from '../components/Exercise/ExerciseCardDisplay';
import { useNavigation } from '@react-navigation/native';

const TabHome = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Exercise');
  const scrollViewRef = useRef(null);


  const tabs = [
    { name: 'About PSP', screen: 'AboutScreen', scrollTo: 200 },
    { name: 'This App', screen: 'AppInfoScreen', scrollTo: 600 },
    { name: 'Exercise', screen: 'ExerciseDetails', scrollTo: 1000 },
    { name: 'Branches', screen: 'BranchesScreen' }
  ];

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

  // About text content
  const [showFullTextAboutPSP, setShowFullTextAboutPSP] = useState(false);
  const [showFullTextAboutAPP, setShowFullTextAboutAPP] = useState(false);

  // About PSPG text content
  const aboutTextPSPG = `
    The Philippine Sports Performance Gym (PSPG) is built on the ideology of maximizing athletic potential through a holistic approach to training and development. Its primary focus is on creating customized training programs that cater to the unique needs of each athlete, recognizing that every individual has different strengths and areas for improvement. PSPG emphasizes the importance of sports science, employing data-driven methods to assess and enhance performance while prioritizing safety and injury prevention. The gym aims to cultivate a supportive community where athletes can thrive, encouraging camaraderie and mutual motivation among members. By integrating strength training, conditioning, and recovery techniques, PSPG strives to foster well-rounded athletes who can excel in their respective sports. The ultimate goal of the gym is to elevate the standards of athletic performance in the Philippines, preparing athletes for national and international competitions. Through dedication, discipline, and innovative training methodologies, PSPG is committed to developing the next generation of elite athletes.
  `;

  // About Application text content
  const aboutTextApp = `
    This mobile application, developed using React Native for your thesis, effectively embodies the structure and services of the Philippine Sports Performance Gym (PSPG). It features a comprehensive membership management system that streamlines the annual membership process for users. The app also includes scheduling functionalities, allowing members and coaches to coordinate their training sessions and classes seamlessly.

    In addition, it incorporates health assessment tools and meal planning features to support users in achieving their fitness goals. One of the standout functionalities is the real-time tracking of gym occupancy, which helps members stay informed about the gym's current capacity and optimize their workout times. Overall, the app aims to enhance the user experience at PSPG by integrating essential services into a single, user-friendly platform.
  `;

  const handleTabPress = (tab) => {
    setActiveTab(tab.name);
    if (tab.scrollTo) {
      scrollViewRef.current.scrollTo({ x: 0, y: tab.scrollTo, animated: true });
    } else {
      navigation.navigate(tab.screen);
    }
  };


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
                <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
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

                  {/* ScrollView of Tabs */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                    {tabs.map((tab, index) => {
                      const isActive = activeTab === tab.name;

                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.tabCard}
                          onPress={() => handleTabPress(tab)}
                        >
                          <Text style={[styles.tabText, isActive && styles.activeText]}>
                            {tab.name}
                          </Text>
                          {isActive && <View style={styles.customUnderline} />}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* About PSP Section */}
                  <View style={styles.aboutContainer}>
                    <Text style={styles.aboutTitle}>About Philippine Sports Performance Gym (PSP)</Text>
                    <View style={styles.aboutCard}>
                      <Image
                        source={require('../../assets/PSPAboutTabHome.jpg')}
                        style={styles.aboutImage}
                        resizeMode='cover'
                      />
                      <Text style={styles.aboutText}>
                        {showFullTextAboutPSP ? aboutTextPSPG : aboutTextPSPG.substring(0, 200) + '...'}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowFullTextAboutPSP(!showFullTextAboutPSP)}
                        style={styles.seeMoreButton}
                      >
                        <Text style={styles.seeMoreText}>{showFullTextAboutPSP ? 'See Less' : 'See More'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                    
                  {/* About Application Section */}
                  <View style={styles.aboutContainer}>
                    <Text style={styles.aboutTitle}>About This Application</Text>
                    <View style={styles.aboutCard}>
                      <Text style={styles.aboutText}>
                        {showFullTextAboutAPP ? aboutTextApp : aboutTextApp.substring(0, 200) + '...'}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowFullTextAboutAPP(!showFullTextAboutAPP)}
                        style={styles.seeMoreButton}
                      >
                        <Text style={styles.seeMoreText}>{showFullTextAboutAPP ? 'See Less' : 'See More'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Exercises Section */}
                  <View style={styles.exerciseSection}>
                    <Text style={styles.exerciseHeader}>Exercises</Text>
                    <ScrollView horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 20, height: 450 }}
                    >
                      {
                        exercises.map((exercise, index) => <ExerciseCardDisplay exercise={exercise} index={index} key={index} />)
                      }
                    </ScrollView>
                  </View>

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
  tabCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#FFAC1C',
  },
  customUnderline: {
    height: 4,
    backgroundColor: '#FFAC1C',
    marginTop: 2,
    width: '100%',
    alignSelf: 'center',
  },
  activeTabCard: {
    backgroundColor: '#FFAC1C',
  },
  exerciseSection: {
    marginVertical: 20,
  },
  exerciseHeader: {
    color: 'white',
    marginLeft: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  aboutContainer: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  aboutCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  aboutImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  seeMoreButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  seeMoreText: {
    color: '#FFAC1C',
    fontWeight: 'bold',
  },
});
