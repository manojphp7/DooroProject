import { API_CONFIG } from "@/config/api";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_CONFIG.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();
      console.log("RESET URL:", data.reset_url);
    //   console.log("FORGOT PASSWORD RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      Alert.alert("Success", "Password reset link has been sent to your email");

      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
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

      {/* Body */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Enter your email</Text>

          <Text style={styles.subtitle}>
            We will send you a password reset link
          </Text>

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            activeOpacity={0.85}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <LinearGradient
              colors={["#c42d6a", "#e8558e"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Send Reset Link</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Back */}
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Stack.Screen options={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
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
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },

  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },

  body: {
    padding: 22,
    flexGrow: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#3a0a1e",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  inputWrap: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },

  input: {
    fontSize: 15,
    color: "#374151",
  },

  btnPrimary: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },

  btnDisabled: {
    opacity: 0.7,
  },

  btnGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  btnPrimaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  backText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#e0377a",
  },
});
