import React, { useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { userLog } from '../../../(services)/api/Users/userLog';

export default function Scanner() {
  const [facing, setFacing] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (permission?.granted === false) requestPermission();
  }, [permission, requestPermission]);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const handleBarcodeScanned = async (scannedData) => {
    if (scanning) {
      setScanning(false);
      const userId = scannedData.data;
      try {
        const response = await userLog(userId);
        const { user } = response;

        setUserInfo({
          id: user._id,
          name: user.name,
          imageUrl: user.image[0]?.url,
        });
        setMessage(response.message);
        setModalVisible(true);
      } catch (error) {
        console.error("Error logging user:", error);
        Alert.alert("Error", "An error occurred while logging the user.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={facing}
        onBarCodeScanned={scanning ? handleBarcodeScanned : undefined}
        barCodeScannerSettings={{
          barCodeTypes: [Camera.Constants.BarCodeType.qr, Camera.Constants.BarCodeType.code128],
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {userInfo?.imageUrl && (
              <Image source={{ uri: userInfo.imageUrl }} style={styles.userImage} />
            )}
            <Text style={styles.userName}>{userInfo?.name}</Text>
            <Text style={styles.userId}>ID: {userInfo?.id}</Text>
            <Text style={styles.userMessage}>{message}</Text>  
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(false);
                Alert.alert(
                  "Scan Complete",
                  "Would you like to scan another QR code?",
                  [
                    {
                      text: "Yes",
                      onPress: () => setScanning(true),
                    },
                    {
                      text: "No",
                      onPress: () => router.push("/components/Admin/(tabs)"),
                    },
                  ]
                );
              }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userId: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 15,
  },
  userMessage: {
    fontSize: 16,
    color: 'green',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
