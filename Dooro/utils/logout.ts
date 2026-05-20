import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

/**
 * Logout user completely
 * - clears token
 * - clears user data
 * - redirects to login screen
 */
export const logout = async () => {
  try {
    // remove stored auth data
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");

    console.log("Logout successful");

    // redirect to login
    router.replace("/login");
  } catch (error) {
    console.log("Logout Error:", error);
  }
};