import { API_CONFIG } from "@/config/api";
import { GOOGLE_CONFIG } from "@/config/google";
import { MaterialIcons } from "@expo/vector-icons";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

useEffect(() => {
  GoogleSignin.configure({
    webClientId: GOOGLE_CONFIG.webClientId,
    offlineAccess: true,
    scopes: ["profile", "email"],
  });
}, []);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      // Step 1 — Google se user info lo
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      const user = userInfo.data?.user;

      if (!user) {
        Alert.alert("Error", "Google sign in failed. Please try again.");
        return;
      }

      // Step 2 — Laravel API call
      const response = await fetch(
        "http://10.0.2.2:8000/api/auth/social-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: "google",
            provider_id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.photo,
          }),
        }
      );

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Step 3 — SecureStore me session save karo
      const sessionData = {
        token: data.token,
        full_name: data.user.name,
        email: data.user.email,
        photo: data.user.photo,
        id: data.user.id,
      };

      await SecureStore.setItemAsync("token", sessionData.token);

      await SecureStore.setItemAsync("user", JSON.stringify(sessionData));

      console.log("SESSION SAVED:", sessionData);

      // Step 4 — Navigate
      router.replace("/home");

      Alert.alert("Success!", `Welcome, ${sessionData.full_name}!`);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign in already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play Services not available");
      } else {
        console.log("GOOGLE ERROR:", error);

        Alert.alert("Error", error.message || "Something went wrong");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

 const handleSignIn = async () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert("Error", "Please enter email and password");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      API_CONFIG.LOGIN,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      }
    );

    const data = await response.json();

    console.log("LOGIN RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // token save
    await SecureStore.setItemAsync("token", data.token);

    // user save
    await SecureStore.setItemAsync(
      "user",
      JSON.stringify(data.user)
    );


    router.replace("/home");

  } catch (error: any) {
    Alert.alert(
      "Login Failed",
      error.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <LinearGradient
        colors={["#c42d6a", "#e8558e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <Text style={styles.logo}>
          Dooro<Text style={styles.logoTm}>®</Text>
        </Text>
        <Text style={styles.headerSub}>Protecting What Matters Most</Text>
      </LinearGradient>

      {/* ── Body ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeSub}>Sign in to your account</Text>

          {/* Email / Username */}
          <Text style={styles.label}>Email or Username</Text>
          <View
            style={[
              styles.inputWrap,
              focused === "email" && styles.inputFocused,
            ]}
          >
            <MaterialIcons name="email" size={18} color="#9ca3af" />
            <TextInput
              style={styles.input}
              placeholder="you@studio.com or username"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputWrap,
              focused === "password" && styles.inputFocused,
            ]}
          >
            <MaterialIcons name="lock" size={18} color="#9ca3af" />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Text style={styles.showBtn}>{showPass ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>


          {/* Forgot */}
          <TouchableOpacity
          style={styles.forgotWrap}
          onPress={() => router.push("/forgot-password")}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={loading}
          >
            <LinearGradient
              colors={["#c42d6a", "#e8558e"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.btnPrimaryText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              activeOpacity={0.8}
              onPress={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color="#374151" />
              ) : (
                <>
                  <Image
                    source={require("../assets/img/google.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.socialText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
         
          </View>

          {/* Sign Up */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.signupLink}>Sign up free</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Stack.Screen options={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7ff" },
  header: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -30,
    right: -20,
  },
  circle2: {
    position: "absolute",
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: 8,
    left: -14,
  },
  logo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  logoTm: { fontSize: 11, color: "rgba(255,255,255,0.6)" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  body: { flex: 1 },
  bodyContent: { padding: 22, paddingBottom: 40 },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#3a0a1e",
    marginBottom: 3,
  },
  welcomeSub: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 14,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFocused: { borderColor: "#e0377a" },
  input: { flex: 1, fontSize: 15, color: "#374151" },
  showBtn: { fontSize: 11, fontWeight: "600", color: "#e0377a" },
  hintBox: {
    backgroundColor: "#fff8e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffe082",
  },
  hintText: { fontSize: 12, color: "#795548" },
  hintBold: { fontWeight: "700", color: "#5d4037" },
  forgotWrap: { alignItems: "flex-end", marginBottom: 18, marginTop: -2 },
  forgotText: { fontSize: 11, fontWeight: "600", color: "#e0377a" },
  btnPrimary: { borderRadius: 12, overflow: "hidden", marginBottom: 14 },
  btnDisabled: { opacity: 0.7 },
  btnGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  btnPrimaryText: { color: "#ffffff", fontSize: 17, fontWeight: "600" },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 13,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  dividerText: { fontSize: 11, color: "#6b7280" },
  socialRow: {
  marginBottom: 24,
},
 socialBtn: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  backgroundColor: "#ffffff",
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 10,
  paddingVertical: 13,
  width: "100%",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},
  socialText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: { fontSize: 14, color: "#6b7280" },
  signupLink: { fontSize: 14, fontWeight: "600", color: "#e0377a" },
});
