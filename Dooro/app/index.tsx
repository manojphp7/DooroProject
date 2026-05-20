import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        console.log("TOKEN:", token);

        setTimeout(() => {
          if (token) {
            console.log("User already logged in");

            router.replace("/home");
          } else {
            console.log("User has not logged in");

            router.replace("/login");
          }
        }, 2000);

      } catch (error) {
        console.log("AUTH CHECK ERROR:", error);

        router.replace("/login");
      }
    };

    checkLogin();
  }, []);

  return (
    <LinearGradient
      colors={["#c42d6a", "#e8558e"]}
      style={styles.container}
    >
      <Text style={styles.logo}>
        Dooro<Text style={styles.tm}>®</Text>
      </Text>

      <Text style={styles.tagline}>
        Protecting What Matters Most
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontSize: 42,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -1,
  },

  tm: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },

  tagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
});