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
import ProgressHeader from "@/components/ProgressHeader";

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

      // SAVE IMAGES LOCALLY
      const imageData = {
        front_image: frontImage,
        closeup_image: closeupImage,
        serial_image: serialImage,
      };

      await SecureStore.setItemAsync("shop_images", JSON.stringify(imageData));

      // GET SHOP DETAILS
      const savedShop = await SecureStore.getItemAsync("shop_details");

      const token = await SecureStore.getItemAsync("token");

      if (!savedShop || !token) {
        setTopError("Missing shop details");

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
        uri: frontImage,
        name: "front.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("closeup_image", {
        uri: closeupImage,
        name: "closeup.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("serial_image", {
        uri: serialImage,
        name: "serial.jpg",
        type: "image/jpeg",
      } as any);

      // CREATE SHOP
      const response = await fetch(API_CONFIG.ADD_SHOP, {
        method: "POST",

        headers: {
          Accept: "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        setTopError(data.message || "Failed to create shop");

        triggerShake();

        return;
      }

      // SAVE SHOP ID
      await SecureStore.setItemAsync("shop_id", String(data.shop.id));

      // NEXT SCREEN
      router.push("/choose-plan");
    } catch (error) {
      console.log(error);

      setTopError("Something went wrong");

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
                <Text style={styles.uploadedTitle}>{title}</Text>

                <Text style={styles.uploadSuccess}>Uploaded successfully</Text>
              </View>

              <View style={styles.check}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontFamily: Typography.fontFamily.bold,
                  }}
                >
                  ✓
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.placeholderIcon}>
                <Text style={styles.placeholderText}>📸</Text>
              </View>

              <Text style={styles.uploadTitle}>{title}</Text>

              <Text style={styles.uploadSubtitle}>{subtitle}</Text>

              {/* <View style={styles.uploadButtonMini}>
                <Text style={styles.uploadButtonMiniText}>Choose Photo</Text>
              </View> */}
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ProgressHeader
        step={1}
        title="Upload photos"
        subtitle="3 photos required for verification"
      />

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

  body: {
    paddingHorizontal: 18,
    paddingBottom: 42,
  },

  contentCard: {
    marginTop: 20,
  },

  uploadCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#e7d6df",
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    minHeight: 170,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  uploadCardDone: {
    borderStyle: "solid",
    borderColor: "rgba(16,185,129,0.22)",
    backgroundColor: "#fcfffd",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },

  uploadCardError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239,68,68,0.04)",
  },

  placeholderIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: "#fff1f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#f6d2e3",
  },

  placeholderText: {
    fontSize: 34,
  },

  uploadTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 16,
    color: "#111827",
    textAlign: "center",
  },

  uploadedTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 16,
    color: "#111827",
    textAlign: "left",
  },

  uploadSubtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    color: "#6b7280",
    marginTop: 7,
    textAlign: "center",
    lineHeight: 20,
  },

  previewImage: {
    width: 78,
    height: 78,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#f3f4f6",
  },

  uploadInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  uploadSuccess: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    color: "#10b981",
    justifyContent: "flex-start",
    marginTop: 6,
  },

  check: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 6,
  },

  buttonText: {
    color: "#fff",
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
  },

  uploadButtonMini: {
    marginTop: 14,
    backgroundColor: "#e0377a",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  uploadButtonMiniText: {
    color: "#fff",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
  },
});
