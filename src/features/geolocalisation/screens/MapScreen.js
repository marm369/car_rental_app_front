import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useMapController } from "../controllers/MapController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"

const MapScreen = () => {
  const navigation = useNavigation()
  const {
    agencies,
    region,
    searchQuery,
    setSearchQuery,
    handleMarkerPress,
    handleSearch,
    loading,
    error,
  } = useMapController();

  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setCurrentUserId(userId);
    };
    fetchCurrentUserId();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleAgencyPress = (agency) => {
    const isCurrentUserAgency =
      currentUserId &&
      agency.userId &&
      currentUserId === agency.userId.toString();
    if (isCurrentUserAgency) {
      navigation.navigate("BottomNavigationBar", { screen: "Cars" });
    } else {
      navigation.navigate("AgencyDetails", {
        agencyId: agency.id,
        isCurrentUserAgency,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search location"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {region && (
        <MapView style={styles.map} initialRegion={region} region={region}>
          {agencies.map((agency) => (
            <Marker
              key={agency.id}
              coordinate={{
                latitude: agency.location.coordinates[1],
                longitude: agency.location.coordinates[0],
              }}
              onPress={() => handleMarkerPress(agency)}
            >
              <View style={styles.markerWrapper}>
                <Image
                  source={{ uri: agency.imageBase64 }}
                  style={styles.markerImage}
                />
              </View>
              <Callout onPress={() => handleAgencyPress(agency)}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{agency.name}</Text>
                  <Text style={styles.calloutDescription}>
                    {agency.description.length > 100
                      ? agency.description.slice(0, 100) + "..."
                      : agency.description}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  searchInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    borderColor: "#3498db",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 55,
    zIndex: 10,
  },
  map: {
    flex: 1,
    marginTop: -100,
    zIndex: 1,
  },
  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    borderRadius: 35,
    padding: 3,
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    color: "#34495e",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
});

export default MapScreen;
