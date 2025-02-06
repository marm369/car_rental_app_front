import { getAllCars, getCarRentalDetails as getCarRentalDetailsService } from "../service/carService"

const CarController = {
  getCars: async () => {
    try {
      const cars = await getAllCars()
      return cars
    } catch (error) {
      console.error("Error fetching cars:", error)
      throw new Error("Failed to fetch cars")
    }
  },
  getCarRentalDetails: async (carId) => {
    try {
      const details = await getCarRentalDetailsService(carId)
      return details
    } catch (error) {
      console.error("Error fetching car rental details:", error)
      throw new Error("Failed to fetch car rental details")
    }
  },
}

export default CarController