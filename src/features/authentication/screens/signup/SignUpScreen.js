import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import SignUpController from "../../controllers/SignUpController.js";
import SignUpStyles from "./SignUpStyles.js";

const SignUpScreen = () => {
  const navigation = useNavigation();

  const {
    formValues,
    setFormValues,
    errors,
    togglePasswordVisibility,
    handleSelectProfileImage,
    handleCreateAccount,
    secureTextEntry,
  } = SignUpController();

  return (
    <ScrollView
      contentContainerStyle={SignUpStyles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={SignUpStyles.textSpace}>
        <Text style={SignUpStyles.title}>Sign Up</Text>
        <Text style={SignUpStyles.subTitle}>
          Please enter your details to sign up
        </Text>
      </View>

      <View style={SignUpStyles.space}>
        {/* Profile Image */}
        <View style={SignUpStyles.profileSection}>
          <TouchableOpacity
            style={SignUpStyles.profileIcon}
            onPress={handleSelectProfileImage}
          >
            {formValues.profileImage ? (
              <Image
                source={{ uri: formValues.profileImage }}
                style={SignUpStyles.profileImage}
              />
            ) : (
              <Icon name="account-circle" size={100} color="#1E90FF" />
            )}
          </TouchableOpacity>
          <Text style={SignUpStyles.profileText}>
            Select your Profile Image
          </Text>
          {errors.profileImage && (
            <Text style={SignUpStyles.errorText}>{errors.profileImage}</Text>
          )}
        </View>

        {/* First Name */}
        <View>
          <View style={SignUpStyles.inputWrapper}>
            <Icon
              name="person"
              size={20}
              color="#1E90FF"
              style={SignUpStyles.iconLeft}
            />
            <TextInput
              style={SignUpStyles.input}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={formValues.firstName}
              onChangeText={(text) =>
                setFormValues({ ...formValues, firstName: text })
              }
            />
          </View>
          {errors.firstName && (
            <Text style={SignUpStyles.errorText}>{errors.firstName}</Text>
          )}
        </View>

        {/* Last Name */}
        <View>
          <View style={SignUpStyles.inputWrapper}>
            <Icon
              name="person"
              size={20}
              color="#1E90FF"
              style={SignUpStyles.iconLeft}
            />
            <TextInput
              style={SignUpStyles.input}
              placeholder="Last Name"
              placeholderTextColor="#888"
              value={formValues.lastName}
              onChangeText={(text) =>
                setFormValues({ ...formValues, lastName: text })
              }
            />
          </View>
          {errors.lastName && (
            <Text style={SignUpStyles.errorText}>{errors.lastName}</Text>
          )}
        </View>

        {/* Phone Number */}
        <View>
          <View style={SignUpStyles.inputWrapper}>
            <Icon
              name="phone"
              size={20}
              color="#1E90FF"
              style={SignUpStyles.iconLeft}
            />
            <TextInput
              style={SignUpStyles.input}
              placeholder="Phone Number"
              placeholderTextColor="#888"
              value={formValues.phoneNumber}
              onChangeText={(text) =>
                setFormValues({ ...formValues, phoneNumber: text })
              }
              keyboardType="phone-pad"
            />
          </View>
          {errors.phoneNumber && (
            <Text style={SignUpStyles.errorText}>{errors.phoneNumber}</Text>
          )}
        </View>

        {/* Username */}
        <View>
          <View style={SignUpStyles.inputWrapper}>
            <Icon
              name="person-outline"
              size={20}
              color="#1E90FF"
              style={SignUpStyles.iconLeft}
            />
            <TextInput
              style={SignUpStyles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              value={formValues.username}
              onChangeText={(text) =>
                setFormValues({ ...formValues, username: text })
              }
            />
          </View>
          {errors.username && (
            <Text style={SignUpStyles.errorText}>{errors.username}</Text>
          )}
        </View>

        {/* Email */}
        <View>
          <View style={SignUpStyles.inputWrapper}>
            <Icon
              name="email"
              size={20}
              color="#1E90FF"
              style={SignUpStyles.iconLeft}
            />
            <TextInput
              style={SignUpStyles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={formValues.email}
              onChangeText={(text) =>
                setFormValues({ ...formValues, email: text })
              }
            />
          </View>
          {errors.email && (
            <Text style={SignUpStyles.errorText}>{errors.email}</Text>
          )}
        </View>

        {/* Password */}
        <View>
          <View style={SignUpStyles.inputWrapper}>
            <Icon
              name="lock"
              size={20}
              color="#1E90FF"
              style={SignUpStyles.iconLeft}
            />
            <TextInput
              style={SignUpStyles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={secureTextEntry}
              value={formValues.password}
              onChangeText={(text) =>
                setFormValues({ ...formValues, password: text })
              }
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={SignUpStyles.iconRight}
            >
              <Icon
                name={secureTextEntry ? "visibility-off" : "visibility"}
                size={20}
                color="#1E90FF"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={SignUpStyles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Confirm Password */}
        <View>
          <View style={SignUpStyles.inputWrapper}>
            <Icon
              name="lock"
              size={20}
              color="#1E90FF"
              style={SignUpStyles.iconLeft}
            />
            <TextInput
              style={SignUpStyles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry={true}
              value={formValues.confirmPassword}
              onChangeText={(text) =>
                setFormValues({ ...formValues, confirmPassword: text })
              }
            />
          </View>
          {errors.confirmPassword && (
            <Text style={SignUpStyles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Role Selection */}

        <View style={SignUpStyles.radioButtonGroup}>
          {/* Option for RENTER */}
          <TouchableOpacity
            style={SignUpStyles.radioButtonContainer}
            onPress={() => setFormValues({ ...formValues, role: "RENTER" })}
          >
            <View style={SignUpStyles.radioCircle}>
              {formValues.role === "RENTER" && (
                <View style={SignUpStyles.selectedCircle} />
              )}
            </View>
            <Text style={SignUpStyles.radioLabel}>Car Store Owner</Text>
          </TouchableOpacity>

          {/* Option for CLIENT */}
          <TouchableOpacity
            style={SignUpStyles.radioButtonContainer}
            onPress={() => setFormValues({ ...formValues, role: "CLIENT" })}
          >
            <View style={SignUpStyles.radioCircle}>
              {formValues.role === "CLIENT" && (
                <View style={SignUpStyles.selectedCircle} />
              )}
            </View>
            <Text style={SignUpStyles.radioLabel}>Client</Text>
          </TouchableOpacity>
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          style={SignUpStyles.createAccountButton}
          onPress={handleCreateAccount}
        >
          <Text style={SignUpStyles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;