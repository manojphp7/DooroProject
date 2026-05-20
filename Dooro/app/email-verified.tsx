import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function EmailVerified() {
  const { token } = useLocalSearchParams();

  useEffect(() => {
    const saveToken = async () => {

      if (!token) return;

      await SecureStore.setItemAsync("token", token as string);

      router.replace("/home");

    };

    saveToken();
  }, [token]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}