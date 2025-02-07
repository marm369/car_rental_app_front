import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../authentication/screens/onboarding/OnboardingScreen";
import LoginScreen from "../authentication/screens/login/LoginScreen";
import BottomNavigationBar from "../navigation/BottomNavigationBar";
import SignUpScreen from "../authentication/screens/signup/SignUpScreen";
import SuccessScreen from "../../common/components/SuccessScreen";
import CarDetailsScreen from "../car/screens/display-cars/CarDetailsScreen";
import AddCarScreen from "../car/screens/add-car/AddCarScreen";
import ChatScreen from "../chat/screens/Chat";
import HomeScreen from "../home/screens/HomeScreen";
import AgencyScreen from "../agency/screens/create-agency/AgencyScreen";
import AgencyCarsScreen from "../car/screens/display-cars/AgencyCarsScreen";
import AgencyDetailsScreen from "../geolocalisation/screens/AgencyDetailsScreen";
import CarRentalDetailsScreen from "../home/screens/CarRentalDetailsScreens";
import ReservationManagementScreen from "../reservation/screens/ReservationManagementScreen";
import ConversationsList from "../chat/screens/ConversationList"; 

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          options={{ headerShown: false }}
          component={OnboardingScreen}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="BottomNavigationBar"
          component={BottomNavigationBar}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessScreen"
          component={SuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddCar"
          component={AddCarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConversationScreen"
          component={ConversationsList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CarDetails"
          component={CarDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Agency"
          component={AgencyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AgencyCars"
          component={AgencyCarsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AgencyDetails"
          component={AgencyDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CarRentalDetails"
          component={CarRentalDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReservationManagement"
          component={ReservationManagementScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
