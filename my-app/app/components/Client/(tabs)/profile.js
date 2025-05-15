import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, StatusBar, ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { logoutAction } from '../../../(redux)/authSlice';
import ProtectedRoute from '../../ProtectedRoute';
import styles from '../../styles/Client/ClientProfileStyles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import SubscriptionReminder from '../components/SubscriptionReminder';

const Profile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigation = useNavigation();

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

    const handleLogout = () => {
        dispatch(logoutAction());
        router.replace("/");
    };
    useEffect(() => {
        if (!user) {
            router.replace("/");
            return;
        }
    }, [user, router]);

    const bottomSheetModalRef = useRef(null);

    const snapPoints = useMemo(() => ['25%', '50%', '75'], []);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    return (
        <ProtectedRoute>
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
                    <BottomSheetModalProvider>

                        {user ? (
                            <>
                                <View>
                                    <Image source={require('../../../../assets/backroundMovable.png')} style={{ alignSelf: 'center' }} />
                                </View>
                                {user && (
                                    user.user ? (
                                        // When user.user is true
                                        user.user.image && user.user.image[0] && user.user.image[0].url && (
                                            <View style={styles.profileImageContainer}>
                                                <Image
                                                    source={{ uri: user.user.image[0].url }}
                                                    style={styles.profileImage}
                                                />
                                                <TouchableOpacity
                                                    style={styles.iconContainer}
                                                    onPress={() => navigation.navigate('components/User/EditUserProfile', { user })}
                                                >
                                                    <FontAwesome name="pencil" size={24} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    ) : (
                                        // When user.user is not true
                                        user.image && user.image[0] && user.image[0].url && (
                                            <View style={styles.profileImageContainer}>
                                                <Image
                                                    source={{ uri: user.image[0].url }}
                                                    style={styles.profileImage}
                                                />
                                                <TouchableOpacity
                                                    style={styles.iconContainer}
                                                    onPress={() => navigation.navigate('components/User/EditUserProfile', { user })}
                                                >
                                                    <FontAwesome name="pencil" size={24} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    )
                                )}
                                <View style={styles.section}>
                                    <TouchableOpacity style={styles.option}
                                        onPress={() => router.push('/components/Client/components/membership')}
                                    >
                                        <Icon name="user" size={24} color="#4caf50" />
                                        <Text style={styles.optionText}>Membership</Text>
                                        <Icon
                                            name="angle-right"
                                            size={24}
                                            color="#999"
                                            style={styles.optionIcon}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.option}
                                        onPress={() => navigation.navigate('components/User/ResetUserPassword', { user })}
                                    >
                                        <Icon name="lock" size={24} color="#f44336" />
                                        <Text style={styles.optionText}>Privacy</Text>
                                        <Icon
                                            name="angle-right"
                                            size={24}
                                            color="#999"
                                            style={styles.optionIcon}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.option}>
                                        <Icon name="info-circle" size={24} color="#3f51b5" />
                                        <Text style={styles.optionText}
                                            onPress={handlePresentModalPress}
                                        >My_QR</Text>
                                        <Icon
                                            name="angle-right"
                                            size={24}
                                            color="#999"
                                            style={styles.optionIcon}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.option} onPress={handleLogout}>
                                        <Icon name="sign-out" size={24} color="#e91e63" />
                                        <Text style={styles.optionText}>Logout</Text>
                                        <Icon
                                            name="angle-right"
                                            size={24}
                                            color="#999"
                                            style={styles.optionIcon}
                                        />
                                    </TouchableOpacity>


                                    {/* About Modal */}
                                    <BottomSheetModal
                                        ref={bottomSheetModalRef}
                                        index={1}
                                        snapPoints={snapPoints}
                                    >
                                        <BottomSheetView style={[styles.bottomSheetContainer, { flex: 1 }]}>
                                            <View style={styles.qrContainer}>
                                                <Text style={styles.qrTitle}>Your QR Code</Text>
                                                <View style={styles.qrBox}>
                                                    <QRCode value={user.user?._id || user._id} size={150} />
                                                </View>
                                            </View>
                                        </BottomSheetView>
                                    </BottomSheetModal>
                                </View>
                            </>
                        ) : (
                            <Text style={styles.text}>No user logged in</Text>
                        )}

                    </BottomSheetModalProvider>
                </View>
            </ImageBackground>
        </ProtectedRoute>
    )
}

export default Profile