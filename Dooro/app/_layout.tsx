import { Stack, router } from "expo-router";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { useFonts } from "expo-font";

import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

import {
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";


function handleDeepLink(url: string) {
  console.log("Deep link URL:", url);
  const parsed = Linking.parse(url);
  console.log("Parsed FULL:", JSON.stringify(parsed)); // Yeh important hai
  
  const { hostname, queryParams } = parsed;

  if (hostname === "reset-password") {
    const token = queryParams?.token as string;
    const email = decodeURIComponent((queryParams?.email as string) || "");
    router.push({
      pathname: "/reset-password",
      params: { token, email },
    });
  }
}

export default function RootLayout() {

   const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="oauthredirect" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="shop-details" options={{ headerShown: false }} />
      <Stack.Screen name="upload-photos" options={{ headerShown: false }} />
      <Stack.Screen name="choose-plan" options={{ headerShown: false }} />
      <Stack.Screen name="policies-screen" options={{ headerShown: false }} />
      <Stack.Screen name="payment-screen" options={{ headerShown: false }} />
      <Stack.Screen name="claim-screen" options={{ headerShown: false }} />
      <Stack.Screen name="create-claim" options={{ headerShown: false }} />
    </Stack>
  );
}
