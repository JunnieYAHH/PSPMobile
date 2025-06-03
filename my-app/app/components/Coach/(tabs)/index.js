import { useRouter } from 'expo-router';
import LoadingScreen from '../../LodingScreen';
import { useDispatch, useSelector } from "react-redux";
import styles from '../../styles/TabHomeStyles';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getAllExercise } from '../../../(services)/api/Exercises/getAllExercise';
import ExerciseCardDisplay from '../../Exercise/ExerciseCardDisplay';
import { Alert, Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CoachIndex = () => {
  const { user } = useSelector((state) => state.auth);

  const router = useRouter();
  const [screenLoading, setScreenLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Exercise');
  const { clientSecret, isLoading, error } = useSelector((state) => state.payment);

  useEffect(() => {
    if (!user) {
      setScreenLoading(false);
    }
  }, [user]);

  const tabs = [
    { name: 'Exercise', screen: 'ExerciseDetails', scrollTo: 1000, color: 'white' },
    { name: 'About PSP', screen: 'AboutScreen', scrollTo: 250, color: 'white' },
    { name: 'This App', screen: 'AppInfoScreen', scrollTo: 680, color: 'white' },
    { name: 'Branches', screen: 'BranchesScreen', scrollTo: 1200, color: 'white' },
    { name: 'BMI', screen: 'BMI', scrollTo: 1400, color: 'white' },
  ];

  //Get API EXERCISE
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
      {screenLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <StatusBar translucent backgroundColor="transparent" />
          <ImageBackground
            source={require('../../../../assets/ProgramBG.png')}
            style={styles.backgroundImage}
            imageStyle={{ opacity: 2.0 }}
            blurRadius={2}
            resizeMode="cover"
          >
            <View style={styles.container}>
              {user ? (
                <>
                  <SafeAreaView style={styles.safeAreaView}>

                    {/* Content Header */}
                    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>

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

                      {/* Header */}
                      <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Philippines</Text>
                        <Text style={styles.headerText}>
                          <Text style={{ fontWeight: 'bold', color: '#FFAC1C' }}>Sports</Text> Performance
                        </Text>
                      </View>

                      {/*ARNOLD */}
                      <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 20, marginBottom: 10 }}>
                        <View style={{
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
                        }}>
                          <View>
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>
                              Arnold Schwarzenegger
                            </Text>
                            <Text style={{ color: 'black', width: '100%' }}>
                              Strength does not come from winning. Your struggles develop your strengths.
                              When you go through hardships and decide not to surrender, that is strength.
                            </Text>
                          </View>
                        </View>
                        <View style={{
                          width: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          <Image
                            source={require('../../../../assets/Arnold.jpg')}
                            style={{
                              width: '100%',
                              height: 100,
                              borderRadius: 10,
                            }}
                            resizeMode="contain"
                          />
                        </View>
                      </View>

                      {/* ScrollView of Tabs */}
                      <View style={styles.tabContainer}>
                        {tabs.map((tab, index) => {
                          const isActive = activeTab === tab.name;
                          return (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.tabCard,
                                { backgroundColor: tab.color },
                                isActive && styles.activeTabCard
                              ]}
                              onPress={() => handleTabPress(tab)}
                            >
                              <Text style={[styles.tabText, isActive && styles.activeText]}>
                                {tab.name}
                              </Text>
                              {isActive && <View style={styles.customUnderline} />}
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {/* Conditionally Render Sections */}
                      {activeTab === 'About PSP' && (
                        <View style={styles.aboutContainer}>
                          <Text style={styles.aboutTitle}>About Philippine Sports Performance Gym (PSP)</Text>
                          <View style={styles.aboutCard}>
                            <Image
                              source={require('../../../../assets/PSPAboutTabHome.jpg')}
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
                      )}

                      {activeTab === 'This App' && (
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
                      )}

                      {activeTab === 'Exercise' && (
                        <View style={styles.exerciseSection}>
                          <Text style={styles.exerciseHeader}>Exercises:</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20, height: 450 }}
                          >

                            {
                              exercises.map((exercise, index) => (
                                <ExerciseCardDisplay exercise={exercise} index={index} key={index} />
                              ))
                            }
                          </ScrollView>
                        </View>
                      )}

                      {activeTab === 'Branches' && (
                        <View style={styles.branchContainer}>
                          <View style={styles.branchCard}>
                            <Image
                              source={require('../../../../assets/PSPBranches.jpg')}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 10,
                              }}
                              resizeMode='cover'
                            />
                          </View>
                        </View>
                      )}

                      {/* You can add more conditional sections for 'Branches', 'BMI' */}
                    </ScrollView>
                  </SafeAreaView>
                  {/* </ImageBackground> */}
                </>
              ) : (
                <Text style={styles.text}>No user logged in</Text>
              )}
            </View>
          </ImageBackground>
        </>
      )}
    </>
  )
}


export default CoachIndex