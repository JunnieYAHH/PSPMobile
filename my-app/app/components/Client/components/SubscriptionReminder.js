// components/alerts/SubscriptionReminder.js
import React, { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { logoutAction } from '../../../(redux)/authSlice';
import baseURL from '../../../../assets/common/baseUrl';

const SubscriptionReminder = ({ expirationDate, userId }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const hasPromptedRef = useRef(false);
    // console.log(userId, 'userID')
    // console.log(expirationDate,'Exp Date')
    const downgradeToUser = async () => {
        try {
            await axios.put(`${baseURL}/users/downgrade-role/${userId}`);
            dispatch(logoutAction());
            router.replace('/');
        } catch (error) {
            console.error("Error downgrading user:", error.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (!expirationDate || hasPromptedRef.current) return;

            const now = new Date();
            const expiration = new Date(expirationDate);

            const isExpiredToday = expiration.toDateString() === now.toDateString();
            const isAlreadyExpired = expiration < now;

            // If expired today or before
            if (isExpiredToday || isAlreadyExpired) {
                hasPromptedRef.current = true;

                Alert.alert(
                    'Membership Expired',
                    'Your membership was terminated. Do you want to be a member again?',
                    [
                        {
                            text: 'No',
                            style: 'destructive',
                            onPress: downgradeToUser
                        },
                        {
                            text: 'Yes',
                            onPress: () => router.push('/components/User/UserMemberShipPayment')
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                const diffTime = expiration.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 3 && diffDays >= 0) {
                    hasPromptedRef.current = true;
                    Alert.alert(
                        'Membership Expiring Soon',
                        `Your membership will expire on ${expiration.toDateString()}. Do you wish to extend it?`,
                        [
                            { text: 'No', style: 'cancel' },
                            { text: 'Yes', onPress: () => router.push('/components/User/UserMemberShipPayment') }
                        ],
                        { cancelable: true }
                    );
                }
            }

            return () => {
                hasPromptedRef.current = false;
            };
        }, [expirationDate])
    );

    return null;
};

export default SubscriptionReminder;