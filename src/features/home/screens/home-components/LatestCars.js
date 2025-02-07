import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getLatestCars } from "../../service/CarService";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const LatestCars = () => {
  const navigation = useNavigation();
  const [latestCars, setLatestCars] = useState([]);

  useEffect(() => {
    const fetchLatestCars = async () => {
      try {
        const cars = await getLatestCars();
        setLatestCars(cars);
      } catch (error) {
        console.error("Error fetching latest cars:", error);
      }
    };

    fetchLatestCars();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Cars</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {latestCars.map((car) => (
          <TouchableOpacity
            key={car.id}
            onPress={() =>
              navigation.navigate("CarRentalDetails", { carId: car.id })
            }
          >
            <View style={styles.carCard}>
              <Image source={{ uri: car.imageUrl }} style={styles.carImage} />
              <View style={styles.carInfo}>
                <Text style={styles.year}>{car.year}</Text>
                <Text style={styles.price}>${car.pricePerDay}/day</Text>
              </View>
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Icon name="directions-car" size={16} color="#555" />
                  <Text style={[styles.detailText, { marginRight: 30 }]}>
                    {car.category}
                  </Text>
                  <FontAwesome
                    name="tint"
                    size={16}
                    color="#555"
                    style={styles.fuelIcon}
                  />
                  <Text style={styles.detailText}>{car.fuelType}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    paddingHorizontal: 16,
    color: "#333",
  },
  carCard: {
    width: 220,
    marginLeft: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  carImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  carInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  year: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0066FF",
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
    marginLeft: 8,
  },
  fuelIcon: {
    marginLeft: 16,
  },
});
