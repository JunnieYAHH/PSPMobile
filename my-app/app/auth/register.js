import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Image, Alert, ImageBackground, StatusBar } from 'react-native';
import { Formik } from 'formik';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { registerUser } from '../(services)/api/Users/registerUserAPI';
import { FontAwesome } from "@expo/vector-icons";
import Constants from 'expo-constants';
import LoadingScreen from '../components/LodingScreen';

// Schema
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is Required"),
  password: Yup.string()
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .min(6, "Password must be at least 6 characters")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character")
    .required("Password is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is Required"),
});

const Register = () => {
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    Alert.alert(
      "Select Image Source",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: async () => {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (permission.status !== "granted") {
              Alert.alert("Permission Denied", "Camera access is required.");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.status !== "granted") {
              Alert.alert("Permission Denied", "Gallery access is required.");
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={styles.container}>
            <ImageBackground
              source={require('../../assets/ProgramBG.png')}
              style={styles.backgroundImage}
              imageStyle={{ opacity: 2.0 }}
              blurRadius={2}
              resizeMode="cover"
            >
              <View style={styles.overlay}>
                <Formik
                  initialValues={{
                    email: "", password: "", confirmPassword: "", phone: "", userBranch: "",
                    name: "", birthDate: "", generalAccess: "", otherAccess: "", address: "", city: "",
                    emergencyContanctName: "", emergencyContanctNumber: ""
                  }}
                  onSubmit={async (values) => {
                    setIsLoading(true);
                    try {
                      const response = await registerUser({
                        ...values,
                        image,
                      });
                      Alert.alert(
                        "Registered Successfully",
                        "You have been registered.",
                        [
                          {
                            text: "OK",
                            onPress: () => {
                              setIsLoading(false);
                              router.push('/');
                            },
                          },
                        ]
                      );
                    } catch (error) {
                      console.error('Registration failed:', error.response?.data?.message || error.message);
                      setIsLoading(false);
                      Alert.alert(
                        "Registration Failed",
                        error.response?.data?.message || "An error occurred during registration. Please try again.",
                        [
                          {
                            text: "OK",
                          },
                        ]
                      );
                    }
                  }}
                  validationSchema={RegisterSchema}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <View style={styles.form}>
                      <View style={{ alignItems: 'center', padding: 10, backgroundColor: '#FFAC1C', marginBottom: 15, borderRadius: 20 }}>
                        <Text style={{ color: 'black', fontSize: 24 }}>Register on our App!</Text>
                      </View>
                      <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                          {image ? (
                            <Image source={{ uri: image }} style={styles.roundImage} />
                          ) : (
                            <>
                              <Text style={styles.placeholderText}>No File Upload</Text>
                              <Text style={styles.placeholderBellowText}>Select Image</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Name"
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                      />
                      {errors.name && touched.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                      )}
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        keyboardType="email-address"
                      />
                      {errors.email && touched.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}
                      <View style={styles.passwordContainer}>
                        <TextInput
                          style={styles.passwordInput}
                          placeholder="Password"
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          <FontAwesome
                            name={showPassword ? "eye-slash" : "eye"}
                            size={19}
                            color="grey"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.password && touched.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                      )}

                      <View style={styles.passwordContainer}>
                        <TextInput
                          style={styles.passwordInput}
                          placeholder="Confirm Password"
                          onChangeText={handleChange("confirmPassword")}
                          onBlur={handleBlur("confirmPassword")}
                          value={values.confirmPassword}
                          secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <FontAwesome
                            name={showConfirmPassword ? "eye-slash" : "eye"}
                            size={19}
                            color="grey"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                      )}
                      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Register</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Formik>
              </View>
            </ImageBackground>
          </View>
        </>
      )}
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: '#fff',
  },
  form: {
    width: "100%",
    borderRadius: 10,
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 5,
    marginVertical: 10,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  imagePicker: {
    width: 150,
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 75,
    backgroundColor: "#e9e9e9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  roundImage: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  placeholderText: {
    color: "#888",
    textAlign: "center",
  },
  placeholderBellowText: {
    color: "#888",
    textAlign: "center",
    fontSize: 12,
  },
});