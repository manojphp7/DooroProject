import { API_CONFIG } from "@/config/api";
import { Typography } from "@/theme/typography";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

import { useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UploadPhotosScreen() {
  const [frontImage, setFrontImage] = useState<string | null>(null);

  const [closeupImage, setCloseupImage] = useState<string | null>(null);

  const [serialImage, setSerialImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    front: false,
    closeup: false,
    serial: false,
  });

  const [topError, setTopError] = useState("");

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pickImage = async (type: "front" | "closeup" | "serial") => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setTopError("Gallery permission is required");

        triggerShake();

        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        allowsEditing: false,
      });

      if (result.canceled) return;

      const imageUri = result.assets[0].uri;

      if (type === "front") {
        setFrontImage(imageUri);

        setErrors((prev) => ({
          ...prev,
          front: false,
        }));
      }

      if (type === "closeup") {
        setCloseupImage(imageUri);

        setErrors((prev) => ({
          ...prev,
          closeup: false,
        }));
      }

      if (type === "serial") {
        setSerialImage(imageUri);

        setErrors((prev) => ({
          ...prev,
          serial: false,
        }));
      }

      setTopError("");
    } catch (error) {
      console.log(error);

      setTopError("Something went wrong while selecting image");

      triggerShake();
    }
  };

  const handleContinue = async () => {
    const newErrors = {
      front: !frontImage,
      closeup: !closeupImage,
      serial: !serialImage,
    };

    setErrors(newErrors);

    if (newErrors.front || newErrors.closeup || newErrors.serial) {
      setTopError("Please upload all required photos");

      triggerShake();

      return;
    }

    try {
      setLoading(true);

      setTopError("");

      // TOKEN
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        setTopError("Session expired. Please login again");

        triggerShake();

        return;
      }

      // GET SAVED SHOP DATA
      const savedShop = await SecureStore.getItemAsync("shop_details");

      if (!savedShop) {
        setTopError("Shop details missing");

        triggerShake();

        return;
      }

      const shopData = JSON.parse(savedShop);

      // FORMDATA
      const formData = new FormData();

      // SHOP DETAILS
      formData.append("shop_name", shopData.shop_name);

      formData.append("address", shopData.address);

      formData.append("mobile", shopData.mobile);

      formData.append("shop_type", shopData.shop_type);

      // IMAGES
      formData.append("front_image", {
        uri: frontImage!,
        name: "front.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("closeup_image", {
        uri: closeupImage!,
        name: "closeup.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("serial_image", {
        uri: serialImage!,
        name: "serial.jpg",
        type: "image/jpeg",
      } as any);

      // API REQUEST
      const response = await fetch(API_CONFIG.UPLOAD_SHOP_IMAGES, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      console.log("FINAL API RESPONSE:", data);

      if (!response.ok) {
        setTopError(data.message || "Failed to submit data");

        triggerShake();

        return;
      }

      // CLEAR TEMP DATA
      await SecureStore.deleteItemAsync("shop_details");
      console.log("Route to Payment");
      // router.push("/payment");
    } catch (error) {
      console.log(error);

      setTopError("Network error");

      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const renderUploadCard = (
    title: string,
    subtitle: string,
    image: string | null,
    onPress: () => void,
    hasError: boolean
  ) => {
    return (
      <Animated.View
        style={[
          hasError && {
            transform: [
              {
                translateX: shakeAnim,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.uploadCard,
            image && styles.uploadCardDone,
            hasError && styles.uploadCardError,
          ]}
          onPress={onPress}
        >
          {image ? (
            <>
              <Image
                source={{ uri: image }}
                style={styles.previewImage}
                resizeMode="cover"
              />

              <View style={styles.uploadInfo}>
                <Text style={styles.uploadTitle}>{title}</Text>

                <Text style={styles.uploadSuccess}>Uploaded successfully</Text>
              </View>

              <Text style={styles.check}>✓</Text>
            </>
          ) : (
            <>
              <View style={styles.placeholderIcon}>
                <Text style={styles.placeholderText}>📸</Text>
              </View>

              <Text style={styles.uploadTitle}>{title}</Text>

              <Text style={styles.uploadSubtitle}>{subtitle}</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#c42d6a", "#e8558e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.circle1} />

        <View style={styles.circle2} />

        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>Dooro</Text>
        </View>

        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepDone]} />

          <View style={[styles.stepDot, styles.stepActive]} />

          <View style={styles.stepDot} />
        </View>

        <View style={{ marginTop: 14 }}>
          <Text style={styles.headerTitle}>Upload photos</Text>

          <Text style={styles.headerSubtitle}>
            3 photos required for verification
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>
          {topError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{topError}</Text>
            </View>
          ) : null}

          {renderUploadCard(
            "Front view of shutter",
            "Tap to upload image",
            frontImage,
            () => pickImage("front"),
            errors.front
          )}

          {renderUploadCard(
            "Close-up shot",
            "Tap to upload image",
            closeupImage,
            () => pickImage("closeup"),
            errors.closeup
          )}

          {renderUploadCard(
            "Serial number photo",
            "Tap to upload image",
            serialImage,
            () => pickImage("serial"),
            errors.serial
          )}

          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>📷 Photo tips</Text>

            <Text style={styles.tipItem}>• Ensure good lighting</Text>

            <Text style={styles.tipItem}>
              • Serial number should be visible
            </Text>

            <Text style={styles.tipItem}>• JPG or PNG only</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            (!frontImage || !closeupImage || !serialImage) && {
              opacity: 0.5,
            },
          ]}
          disabled={!frontImage || !closeupImage || !serialImage || loading}
          onPress={handleContinue}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue →</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7fb",
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: 0,
    left: -10,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  logo: {
    color: "#fff",
    fontSize: 22,
    fontFamily: Typography.fontFamily.display,
  },

  stepRow: {
    flexDirection: "row",
    marginTop: 24,
  },

  stepDot: {
    width: 20,
    height: 4,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginRight: 6,
  },

  stepDone: {
    backgroundColor: "rgba(255,255,255,0.6)",
  },

  stepActive: {
    width: 30,
    backgroundColor: "#fff",
  },

  headerTitle: {
    color: "#fff",
    fontFamily: Typography.fontFamily.display,
    fontSize: Typography.size.xxl,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    marginTop: 4,
  },

  body: {
    paddingHorizontal: 18,
    paddingTop: 0,
    paddingBottom: 42,
  },

  contentCard: {
    marginTop: 20,
  },

  uploadCard: {
    width: "100%",
    maxWidth: 300,

    alignSelf: "center",

    backgroundColor: "#ffffff",

    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#f1d4e2",

    borderRadius: 24,

    paddingVertical: 24,
    paddingHorizontal: 18,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16,

    shadowColor: "#c42d6a",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 12,

    elevation: 3,
  },

  uploadCardDone: {
    borderStyle: "solid",
    borderColor: "rgba(224,55,122,0.22)",
    backgroundColor: "#fff8fb",

    flexDirection: "row",
    alignItems: "center",
  },

  uploadCardError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239,68,68,0.04)",
  },

  placeholderIcon: {
    width: 74,
    height: 74,
    borderRadius: 37,

    backgroundColor: "#fff1f6",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 14,

    borderWidth: 1,
    borderColor: "rgba(224,55,122,0.08)",
  },

  placeholderText: {
    fontSize: 30,
  },

  uploadTitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.md,
    color: "#1f2937",
  },

  uploadSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: "#9ca3af",

    marginTop: 5,
    textAlign: "center",
    lineHeight: 20,
  },

  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 18,
  },

  uploadInfo: {
    flex: 1,
    marginLeft: 14,
  },

  uploadSuccess: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: "#10b981",
    marginTop: 5,
  },

  check: {
    width: 34,
    height: 34,
    borderRadius: 17,

    backgroundColor: "#10b981",

    textAlign: "center",
    lineHeight: 34,

    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },

  tipBox: {
    marginTop: 10,

    backgroundColor: "#e0377a0f",

    borderRadius: 20,

    paddingVertical: 18,
    paddingHorizontal: 16,

    borderWidth: 1,
    borderColor: "rgba(224,55,122,0.08)",

    borderLeftWidth: 4,
    borderLeftColor: "#e0377a",
  },

  tipTitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.md,
    color: "#e0377a",

    marginBottom: 12,
  },

  tipItem: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,

    color: "#6b7280",

    marginBottom: 8,
    lineHeight: 20,
  },

  errorBox: {
    backgroundColor: "rgba(239,68,68,0.08)",

    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.15)",

    paddingVertical: 12,
    paddingHorizontal: 14,

    borderRadius: 14,

    marginBottom: 16,
  },

  errorText: {
    color: "#ef4444",
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
  },

  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,

    backgroundColor: "#fff7fb",
  },

  button: {
    height: 58,

    borderRadius: 18,

    backgroundColor: "#e0377a",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#e0377a",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.22,
    shadowRadius: 18,

    elevation: 6,
  },

  buttonText: {
    color: "#fff",
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
  },
});
