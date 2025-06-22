import React, { useState, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { userLog } from '../../../(services)/api/Users/userLog';
import { useSelector } from 'react-redux';

export default function Scanner() {
  const [facing, setFacing] = useState(CameraType.back);
  const [permission, requestPermission] = useCameraPermissions(false);
  const [scanning, setScanning] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (permission === null) return;
    if (!permission.granted) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    setScanning(true);
    return () => setScanning(false);
  }, []);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const handleBarcodeScanned = async (scannedData) => {
    if (scanning) {
      setScanning(false);

      const userId = scannedData.data;
      const adminBranchId = user?.user?.userBranch;

      try {
        const response = await userLog(userId, adminBranchId);
        // console.log(response.message)
        const { user } = response;

        setUserInfo({
          id: user._id,
          name: user.name,
          imageUrl: user.image[0]?.url,
        });
        setMessage(response.message)
        setModalVisible(true);

      } catch (error) {
        console.error("Error logging user:", error);
        Alert.alert("Error", "An error occurred while logging the user.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        mode="picture"
        barcodeScannerSettings={{
          barCodeTypes: ["qr", "code128"],
        }}
        onBarcodeScanned={handleBarcodeScanned}
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
                      onPress: () => {
                        setScanning(true);
                        setTimeout(() => {
                          setScanning(true);
                        }, 2000);
                      },
                    },
                    {
                      text: "No",
                      onPress: () => {
                        router.push("/components/Admin/(tabs)");
                      },
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