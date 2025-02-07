import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { login } from "../../redux/actions/authActions";
import LoginStyles from "./LoginStyles";
import Images from "../../../../utils/constants/Images";
import Texts from "../../../../utils/constants/Texts";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error } = useSelector((state) => state.auth);

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleSignIn = async () => {
    console.log("Username:", formValues.username);
    console.log("Password:", formValues.password);

    if (!formValues.username || !formValues.password) {
      alert("Username and Password are required.");
      return;
    }

    const result = await dispatch(login(formValues));
    if (result.success) {
      console.log("Login successful!");
      navigation.reset({
        index: 0,
        routes: [{ name: "BottomNavigationBar" }],
      });
    } else {
      alert(`Login failed: ${result.message}`);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={LoginStyles.container}>
      <Image source={Images.imageLogo} style={LoginStyles.logo1} resizeMode="contain" />
      <Image
        source={Images.lightTextLogo}
        style={LoginStyles.logo2}
        resizeMode="contain"
      />

      <Text style={LoginStyles.title}>{Texts.loginTitle}</Text>
      <Text style={LoginStyles.subTitle}>{Texts.loginSubTitle}</Text>

      <View style={LoginStyles.space}>
        <View style={LoginStyles.inputWrapper}>
          <Icon name="email" size={20} color="#888" style={LoginStyles.iconLeft} />
          <TextInput
            style={LoginStyles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={formValues.username}
            onChangeText={(text) => handleInputChange("username", text)}
          />
        </View>

        <View style={LoginStyles.inputWrapper}>
          <Icon name="lock" size={20} color="#888" style={LoginStyles.iconLeft} />
          <TextInput
            style={LoginStyles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={secureTextEntry}
            value={formValues.password}
            onChangeText={(text) => handleInputChange("password", text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={LoginStyles.iconRight}>
            <Icon
              name={secureTextEntry ? "visibility-off" : "visibility"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {error && <Text style={{ color: "red" }}>{error}</Text>}

        <TouchableOpacity style={LoginStyles.signInButton} onPress={handleSignIn}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={LoginStyles.signInText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={LoginStyles.createAccountButton} onPress={handleCreateAccount}>
          <Text style={LoginStyles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
