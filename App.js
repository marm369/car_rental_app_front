import React from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import store from "./src/features/authentication/redux/store";
import AppNavigation from "./src/features/navigation/AppNavigation";

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}
