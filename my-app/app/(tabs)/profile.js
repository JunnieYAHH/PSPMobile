import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { logoutAction } from "../(redux)/authSlice";
import ProtectedRoute from "../components/ProtectedRoute";
import Constants from 'expo-constants';
import Icon from "react-native-vector-icons/FontAwesome";


export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  return (
    <ProtectedRoute>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        {user ? (
          <>
            {user.user.image && user.user.image[0] && user.user.image[0].url && (
              <Image
                source={{ uri: user.user.image[0].url }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            )}
            <Text style={styles.text}>Email: {user.user.email}</Text>
            <View style={styles.section}>
              <TouchableOpacity style={styles.option}>
                <Icon name="user" size={24} color="#4caf50" />
                <Text style={styles.optionText}>Account</Text>
                <Icon
                  name="angle-right"
                  size={24}
                  color="#999"
                  style={styles.optionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Icon name="bell" size={24} color="#ff9800" />
                <Text style={styles.optionText}>Notifications</Text>
                <Icon
                  name="angle-right"
                  size={24}
                  color="#999"
                  style={styles.optionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
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
                <Text style={styles.optionText}>About</Text>
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
            </View>
          </>
        ) : (
          <Text style={styles.text}>No user logged in</Text>
        )}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    paddingTop: Constants.statusBarHeight,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: 'center'
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  optionIcon: {
    marginLeft: "auto",
  },
});