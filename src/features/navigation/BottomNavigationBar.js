import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../config/Config";

const Tab = createBottomTabNavigator();

// Lazy-loaded components
const HomeScreen = React.lazy(() => import("../home/screens/HomeScreen"));
const MapScreen = React.lazy(() =>
  import("../geolocalisation/screens/MapScreen")
);
const ProfileScreen = React.lazy(() =>
  import("../profile/screens/ProfileScreen")
);
const AgencyScreen = React.lazy(() =>
  import("../agency/screens/create-agency/AgencyScreen")
);
const AgencyCarsScreen = React.lazy(() =>
  import("../car/screens/display-cars/AgencyCarsScreen")
);
const ReservationScreen = React.lazy(() =>
  import("../reservation/screens/ResponsesScreen")
);

export default function BottomNavigationBar() {
  const [isCreated, setIsCreated] = useState(false);
  const [isAgency, setIsAgency] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencyStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          console.error("UserId not found in AsyncStorage");
          setIsAgency(false);
          setLoading(false);
          return;
        }
        const role = await AsyncStorage.getItem("role");
        if (!role) {
          console.error("role not found in AsyncStorage");
          setIsAgency(false);
          setLoading(false);
          return;
        }

        let isAgencyRole = false;
        if (role === "RENTER") {
          isAgencyRole = true;
        }
        if (isAgencyRole) {
          const agencyResponse = await fetch(
            `${API_BASE_URL}/agencies/user/${userId}/hasAgency`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!agencyResponse.ok) {
            throw new Error(`HTTP error! status: ${agencyResponse.status}`);
          }

          const isCreatedStatus = await agencyResponse.json();

          setIsAgency(true);
          setIsCreated(isCreatedStatus.hasAgency);
        } else {
          setIsAgency(false);
          setIsCreated(false);
        }
      } catch (error) {
        console.error("Error fetching agency status:", error);
        setIsAgency(false);
        setIsCreated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencyStatus();
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarButton: (props) => <CustomTabButton {...props} route={route} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreenWithLoader} />
      {isAgency ? (
        isCreated ? (
          <Tab.Screen name="Cars" component={AgencyCarsScreen} />
        ) : (
          <Tab.Screen name="Agency" component={AgencyScreen} />
        )
      ) : (
        <Tab.Screen name="Reservation" component={ReservationScreen} />
      )}
      <Tab.Screen name="Profile" component={ProfileScreenWithLoader} />
    </Tab.Navigator>
  );
}

function CustomTabButton({ accessibilityState, children, onPress, route }) {
  const isSelected = accessibilityState?.selected;

  let activeBackgroundColor = "#E5E5E5";
  let activeIconColor = "#000";

  switch (route.name) {
    case "Home":
      activeBackgroundColor = "rgba(30, 144, 255, 0.1)";
      activeIconColor = "#1E90FF";
      break;
    case "Map":
      activeBackgroundColor = "rgba(255, 99, 71, 0.1)";
      activeIconColor = "#FF6347";
      break;
    case "Reservation":
      activeBackgroundColor = "rgba(255, 165, 0, 0.1)";
      activeIconColor = "#FFA500";
      break;
    case "Agency":
    case "Cars":
      activeBackgroundColor = "rgba(0, 128, 128, 0.1)";
      activeIconColor = "#008080";
      break;
    case "Profile":
      activeBackgroundColor = "rgba(138, 43, 226, 0.1)";
      activeIconColor = "#8A2BE2";
      break;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tabButton,
        isSelected ? { backgroundColor: activeBackgroundColor } : null,
      ]}
    >
      <Ionicons
        name={getIconName(route.name, isSelected)}
        size={22}
        color={isSelected ? activeIconColor : "#000"}
        style={{ fontWeight: isSelected ? "bold" : "normal" }}
      />
      {isSelected && (
        <Text style={[styles.tabText, { color: activeIconColor }]}>
          {route.name}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function getIconName(routeName, isSelected) {
  const iconNames = {
    Home: ["home", "home-outline"],
    Map: ["map", "map-outline"],
    Reservation: ["calendar", "calendar-outline"],
    Agency: ["storefront", "storefront-outline"],
    Cars: ["car", "car-outline"],
    Profile: ["person", "person-outline"],
  };

  return iconNames[routeName][isSelected ? 0 : 1];
}

function LoadingFallback() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
}

function MapScreenWithLoader() {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <MapScreen />
    </React.Suspense>
  );
}

function ProfileScreenWithLoader() {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <ProfileScreen />
    </React.Suspense>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tabBar: {
    height: 80,
    backgroundColor: "#FDFDFD",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 6,
    marginVertical: 7,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
