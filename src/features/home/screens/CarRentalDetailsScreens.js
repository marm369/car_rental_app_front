import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Users,
  Fuel,
  DollarSign,
  Calendar,
  ArrowLeft,
  MessageCircle,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CarController from "../controller/CarController";
import ReservationDialog from "../../reservation/screens/ReservationDialog";
import { ReservationService } from "../../reservation/services/ReservationService";

const { height, width } = Dimensions.get("window");

const CarRentalDetailsScreen = ({ route, navigation }) => {
  const { carId } = route.params;
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const fetchCarDetails = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setCurrentUserId(userId);
      try {
        const details = await CarController.getCarRentalDetails(carId);
        setCarDetails(details);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const handleRentCar = () => {
    setShowReservationDialog(true);
  };
  const handleReservationSubmit = async (startDate, endDate) => {
    setShowReservationDialog(false);
    try {
      const reservationData = {
        userId: Number(currentUserId),
        carId: carId,
        ownerId: Number(carDetails.ownerId),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      const response = await ReservationService.createReservation(
        reservationData
      );
      Alert.alert("Reservation Status", response.message);
    } catch (error) {
      console.error("Error creating reservation:", error);
      Alert.alert("Error", "Failed to create reservation. Please try again.");
    }
  };
  const headerHeight = height * 0.4;
  const scrollDistance = headerHeight - 50;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, scrollDistance],
    outputRange: [0, -scrollDistance],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, scrollDistance / 2, scrollDistance],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!carDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load car details</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.imageContainer,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <Image source={{ uri: carDetails.image }} style={styles.carImage} />
        </Animated.View>
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.3)", "transparent"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Animated.Text
            style={[styles.headerTitle, { opacity: titleOpacity }]}
          >
            {carDetails.brand} {carDetails.model}
          </Animated.Text>
        </View>
      </View>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.brandName}>{carDetails.brand}</Text>
          <Text style={styles.modelName}>{carDetails.model}</Text>
          <Text style={styles.carCategory}>{carDetails.category}</Text>
          <Text style={styles.carDetails}>{carDetails.year}</Text>

          <View style={styles.featureContainer}>
            <FeatureItem
              icon={<Users size={24} color="#FFFFFF" />}
              text={`${carDetails.nbrPersonnes} Persons`}
            />
            <FeatureItem
              icon={<Fuel size={24} color="#FFFFFF" />}
              text={carDetails.fuel}
            />
            <FeatureItem
              icon={<Calendar size={24} color="#FFFFFF" />}
              text={carDetails.year.toString()}
            />
            <FeatureItem
              icon={<DollarSign size={24} color="#FFFFFF" />}
              text={`$${carDetails.priceOfDay}/day`}
            />
          </View>

          <View style={styles.agencyContainer}>
            <Image
              source={{ uri: carDetails.agencyImage }}
              style={styles.agencyImage}
            />
            <View style={styles.agencyInfo}>
              <Text style={styles.agencyName}>{carDetails.agencyName}</Text>
              <Text style={styles.agencyType}>Rental Agency</Text>
            </View>
          </View>
        </View>
        {Number(currentUserId) !== carDetails.ownerId && (
          <View style={styles.detailsCurrentUserContainer}>
            <View style={styles.ownerContainer}>
              <Image
                source={{ uri: carDetails.ownerImage }}
                style={styles.ownerImage}
              />
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{carDetails.ownerName}</Text>
                <Text style={styles.ownerType}>Car Owner</Text>
              </View>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => navigation.navigate("ChatScreen", { ownerId: carDetails.ownerId })}
              >
                <MessageCircle size={24} color="#1E90FF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.rentButton} onPress={handleRentCar}>
              <Text style={styles.rentButtonText}>Rent Car</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.ScrollView>
      <ReservationDialog
        visible={showReservationDialog}
        onClose={() => setShowReservationDialog(false)}
        onSubmit={handleReservationSubmit}
      />
    </View>
  );
};

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <LinearGradient
      colors={["#007BFF", "#0056D2"]}
      style={styles.featureIconContainer}
    >
      {icon}
    </LinearGradient>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    overflow: "hidden",
    zIndex: 10,
  },
  headerContent: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  carImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: height * 0.4,
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  detailsCurrentUserContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 100,
    marginTop: -80,
  },
  brandName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 5,
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 2,
  },
  modelName: {
    fontSize: 26,
    fontWeight: "600",
    color: "#4A4A4A",
    textAlign: "center",
    marginBottom: 10,
  },
  carCategory: {
    fontSize: 20,
    fontWeight: "500",
    color: "#6C757D",
    textAlign: "center",
    marginBottom: 10,
  },
  carDetails: {
    fontSize: 18,
    color: "#4A4A4A",
    marginBottom: 20,
    textAlign: "center",
  },
  featureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
    backgroundColor: "#F0F8FF",
    borderRadius: 15,
    padding: 15,
  },
  featureItem: {
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#4A4A4A",
    textAlign: "center",
  },
  agencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 15,
    padding: 15,
  },
  agencyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  agencyInfo: {
    flex: 1,
  },
  agencyName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A4A4A",
  },
  agencyType: {
    fontSize: 14,
    color: "#6C757D",
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 15,
    padding: 15,
  },
  ownerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A4A4A",
  },
  ownerType: {
    fontSize: 14,
    color: "#6C757D",
  },
  messageButton: {
    padding: 10,
  },
  rentButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  rentButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CarRentalDetailsScreen;
