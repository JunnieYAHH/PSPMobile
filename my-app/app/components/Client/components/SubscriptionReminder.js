import React, { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { logoutAction } from '../../../(redux)/authSlice';
import baseURL from '../../../../assets/common/baseUrl';

const REMINDER_SUPPRESSION_KEY = 'membership_reminder_last_dismissed';

const SubscriptionReminder = ({ expirationDate, userId }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const hasPromptedRef = useRef(false);

    const downgradeToUser = async () => {
        try {
            await axios.put(`${baseURL}/users/downgrade-role/${userId}`);
            dispatch(logoutAction());
            router.replace('/');
        } catch (error) {
            console.error("Error downgrading user:", error.message);
        }
    };

    const checkSuppression = async () => {
        try {
            const lastDismissed = await AsyncStorage.getItem(REMINDER_SUPPRESSION_KEY);
            if (!lastDismissed) return false;

            const lastDismissedDate = new Date(lastDismissed);
            const now = new Date();

            const diffMs = now - lastDismissedDate;
            const diffHours = diffMs / (1000 * 60 * 60);

            return diffHours < 24;
        } catch (error) {
            console.error("Error checking suppression:", error.message);
            return false;
        }
    };

    const setSuppression = async () => {
        try {
            await AsyncStorage.setItem(REMINDER_SUPPRESSION_KEY, new Date().toISOString());
        } catch (error) {
            console.error("Error setting suppression:", error.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const runReminderCheck = async () => {
                if (!expirationDate || hasPromptedRef.current) return;

                const isSuppressed = await checkSuppression();
                if (isSuppressed) return;

                const now = new Date();
                const expiration = new Date(expirationDate);

                const isExpiredToday = expiration.toDateString() === now.toDateString();
                const isAlreadyExpired = expiration < now;

                if (isExpiredToday || isAlreadyExpired) {
                    hasPromptedRef.current = true;

                    Alert.alert(
                        'Membership Expired',
                        'Your membership was terminated. Do you want to be a member again?',
                        [
                            {
                                text: "Don't Remind Me Today",
                                style: 'cancel',
                                onPress: setSuppression,
                            },
                            {
                                text: 'No',
                                style: 'destructive',
                                onPress: downgradeToUser,
                            },
                            {
                                text: 'Yes',
                                onPress: () => router.push('/components/User/UserMemberShipPayment'),
                            },
                        ],
                        { cancelable: false }
                    );
                } else {
                    const diffTime = expiration.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 15 && diffDays >= 0) {
                        hasPromptedRef.current = true;

                        Alert.alert(
                            'Membership Expiring Soon',
                            `Your membership will expire on ${expiration.toDateString()}. Do you wish to extend it?`,
                            [
                                {
                                    text: "Don't Remind Me Today",
                                    style: 'cancel',
                                    onPress: setSuppression,
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => router.push('/components/User/UserMemberShipPayment'),
                                },
                            ],
                            { cancelable: true }
                        );
                    }
                }
            };

            runReminderCheck();

            return () => {
                hasPromptedRef.current = false;
            };
        }, [expirationDate])
    );

    return null;
};

export default SubscriptionReminder;