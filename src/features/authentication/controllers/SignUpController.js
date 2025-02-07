import React, { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { validateSignUpForm } from "../../../utils/formatters/formatters.js";
import { handleCreateAccountRequest } from "../services/SignUpService.js";
import { SignUpModel } from "../models/SignUpModel.js";
const SignUpController = () => {
  const navigation = useNavigation();

  const [formValues, setFormValues] = useState(SignUpModel);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleSelectProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your gallery."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
      });

      if (!pickerResult.canceled) {
        const selectedImage = pickerResult.assets
          ? pickerResult.assets[0]
          : pickerResult;
        setFormValues((prevValues) => ({
          ...prevValues,
          profileImage: `data:image/jpeg;base64,${selectedImage.base64}`,
        }));
      }
    } catch (error) {
      console.error("Error selecting image: ", error);
      Alert.alert("Error", "An error occurred while selecting the image.");
    }
  };

  const handleCreateAccount = async () => {
    const { valid, errors } = validateSignUpForm(formValues);

    if (valid) {
      const result = await handleCreateAccountRequest(formValues);
      if (result) {
        navigation.navigate("SuccessScreen", {
          imageSource: require("../../../../assets/images/account-success.png"),
          title: "Account Created!",
          subTitle: "Your account has been successfully created.",
          navigateTo: "Login",
        });
      }
    } else {
      setErrors(errors);
      console.log("Form has errors", errors);
    }
  };

  return {
    formValues,
    setFormValues,
    errors,
    togglePasswordVisibility,
    handleSelectProfileImage,
    handleCreateAccount,
    secureTextEntry,
  };
};

export default SignUpController;