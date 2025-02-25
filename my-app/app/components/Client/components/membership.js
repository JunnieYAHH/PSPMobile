import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

const Membership = () => {
    const userData = useSelector((state) => state.auth.user);
    const user = userData?.user || userData;
    const id = user?._id;
    const [memberInfo, setMembershipInfo] = useState(null);

    const getMembershipInfo = async () => {
        if (!id) return;
        try {
            const { data } = await axios.get(`${baseURL}/transaction/info/${id}`);
            if (data.success) {
                setMembershipInfo(data.transaction);
            }
        } catch (error) {
            console.error("Error fetching membership info:", error);
        }
    };

    useEffect(() => {
        getMembershipInfo();
    }, [id]);

    if (!memberInfo) {
        return (
            <View style={styles.container}>
                <Text>Loading membership info...</Text>
            </View>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };

    console.log(memberInfo)

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../../../../assets/ProgramBG.png')}
                style={{ flex: 1 }}
                imageStyle={{ opacity: 2.0 }}
                blurRadius={2}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <Image source={require('../../../../assets/backroundMovable.png')} style={styles.logo} />
                    <Text style={styles.header}>My Account</Text>
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Account Details</Text>
                        <DetailItem label="Name" value={user.name} />
                        <DetailItem label="Phone" value={memberInfo.phone} />
                        <DetailItem label="Email" value={user.email || 'N/A'} />
                        <DetailItem label="Address" value={memberInfo.address} />
                        <DetailItem label="City" value={memberInfo.city} />
                        <DetailItem label="Membership Expiry" value={formatDate(memberInfo.subscriptionExpiration)} />
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Membership Card</Text>
                        <View style={styles.cardContainer}>
                            <Text style={styles.memberName}>{user.name}</Text>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={{ uri: user.image[0].url }}
                                    style={styles.profileImage}
                                />
                            </View>
                            <Text style={styles.memberType}>Type: {memberInfo.transactionType}</Text>
                            <Text style={styles.expiry}>Expiry: {formatDate(memberInfo.subscriptionExpiration)}</Text>
                            <View style={styles.signatureContainer}>
                                <Text style={styles.signatureLabel}>Signature:</Text>
                                {memberInfo.signature && memberInfo.signature.length > 0 ? (
                                    <Image
                                        source={{ uri: memberInfo.signature[0].url }}
                                        style={styles.signatureImage}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Text style={styles.noSignatureText}>No signature available</Text>
                                )}
                            </View>

                        </View>
                    </View>
                </View>
            </ImageBackground>
        </ScrollView>
    );
};

const DetailItem = ({ label, value }) => (
    <View style={styles.detailItem}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
    },
    value: {
        color: '#555',
    },
    cardContainer: {
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    logo: {
        marginTop: 20,
        width: '80%',
        height: '20%',
        marginBottom: 10,
        alignSelf: 'center'
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    memberType: {
        fontSize: 14,
        marginBottom: 5,
    },
    expiry: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'red',
    },
    profileImageContainer: {
        padding: 20,
        backgroundColor: 'white',
        width: 110,
        height: 110,
        borderRadius: 50,
        alignSelf: 'center',
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 5,
    },
    signatureContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    signatureLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    signatureImage: {
        width: 150,
        height: 80,
    },
    noSignatureText: {
        fontSize: 14,
        color: 'gray',
    },
});

export default Membership;