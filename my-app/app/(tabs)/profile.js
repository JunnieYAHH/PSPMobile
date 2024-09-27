import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { logoutAction } from "../(redux)/authSlice";
import ProtectedRoute from "../components/ProtectedRoute";
import Constants from 'expo-constants';


export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  // console.log("User state:", useSelector((state) => state.auth));

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
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
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
    textAlign:'center'
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
});