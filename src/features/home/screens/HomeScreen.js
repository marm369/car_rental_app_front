import React, { useState, useCallback } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AppBar } from "./home-components/AppBar";
import { LatestCars } from "./home-components/LatestCars";
import FilterBar from "./home-components/FilterBar";
import { CarList } from "./home-components/CarList";

const HomeScreen = () => {
  const [filters, setFilters] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const applyFilters = (selectedFilters) => {
    setFilters(selectedFilters);
  };

  const resetFilters = () => {
    setFilters(null);
  };

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prevKey) => prevKey + 1);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <LatestCars key={`latestCars-${refreshKey}`} />
        <FilterBar onFilterApply={applyFilters} onResetFilters={resetFilters} />
        <CarList key={`carList-${refreshKey}`} filters={filters} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default HomeScreen;
