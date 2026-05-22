import { API_CONFIG } from "@/config/api";
import { Typography } from "@/theme/typography";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Animated } from "react-native";
import { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProgressHeader from "@/components/ProgressHeader";

const SHOP_TYPES = ["Camera Repair", "Electronics", "Photography", "Other"];

export default function ShopDetailsScreen() {
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [shopType, setShopType] = useState("Camera Repair");
  const [otherShopType, setOtherShopType] = useState("");

  const [errors, setErrors] = useState({
    shopName: false,
    address: false,
    mobile: false,
    otherShopType: false,
  });

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);

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

  const handleContinue = async () => {
    const newErrors = {
      shopName: !shopName,
      address: !address,
      mobile: !mobile,
      otherShopType: shopType === "Other" && !otherShopType,
    };

    setErrors(newErrors);

    if (newErrors.shopName || newErrors.address || newErrors.mobile) {
      triggerShake();
      return;
    }

    try {
      setLoading(true);

      // TEMP SAVE
      await SecureStore.setItemAsync(
        "shop_details",
        JSON.stringify({
          shop_name: shopName,
          address,
          mobile,
          shop_type: shopType === "Other" ? otherShopType : shopType,
        })
      );

      router.push("/upload-photos");
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ProgressHeader
        step={0}
        title="Shop details"
        subtitle="Tell us about your business"
      />

      {/* BODY */}
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* SHOP NAME */}
        <Animated.View
          style={[
            styles.fieldWrapper,
            errors.shopName && {
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          <Text style={styles.label}>Shop / Business Name</Text>

          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Enter shop name"
            placeholderTextColor="#9aa3b2"
            value={shopName}
            style={[styles.input, errors.shopName && styles.inputError]}
            onChangeText={(text) => {
              setShopName(text);

              setErrors((prev) => ({
                ...prev,
                shopName: false,
              }));
            }}
          />
        </Animated.View>

        {/* ADDRESS */}
        <Animated.View
          style={[
            styles.fieldWrapper,
            errors.shopName && {
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          <Text style={styles.label}>Address</Text>

          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Enter your full address"
            placeholderTextColor="#9aa3b2"
            value={address}
            multiline
            style={[
              styles.input,
              styles.textArea,
              errors.address && styles.inputError,
            ]}
            onChangeText={(text) => {
              setAddress(text);

              setErrors((prev) => ({
                ...prev,
                shopName: false,
              }));
            }}
          />
        </Animated.View>

        {/* MOBILE */}
        <Animated.View
          style={[
            styles.fieldWrapper,
            errors.shopName && {
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          <Text style={styles.label}>Mobile Number</Text>

          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Enter mobile number"
            placeholderTextColor="#9aa3b2"
            value={mobile}
            keyboardType="phone-pad"
            style={[styles.input, errors.mobile && styles.inputError]}
            onChangeText={(text) => {
              // ONLY ALLOW: 0-9 + - space
              const cleaned = text.replace(/[^0-9+\-]/g, "");

              setMobile(cleaned);

              setErrors((prev) => ({
                ...prev,
                mobile: false,
              }));
            }}
          />
        </Animated.View>

        {/* SHOP TYPE */}
        <Animated.View
          style={[
            styles.fieldWrapper,
            errors.shopName && {
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          <Text style={styles.label}>Shop Type</Text>

          <View style={styles.chipContainer}>
            {SHOP_TYPES.map((item) => {
              const selected = shopType === item;

              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, selected && styles.selectedChip]}
                  onPress={() => setShopType(item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.selectedChipText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
        {shopType === "Other" && (
          <Animated.View
            style={[
              styles.otherTypeWrapper,

              errors.otherShopType && {
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Enter your shop type"
              placeholderTextColor="#9aa3b2"
              value={otherShopType}
              style={[styles.input, errors.otherShopType && styles.inputError]}
              onChangeText={(text) => {
                setOtherShopType(text);

                setErrors((prev) => ({
                  ...prev,
                  otherShopType: false,
                }));
              }}
            />
          </Animated.View>
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
          disabled={loading}
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

  stepRow: {
    flexDirection: "row",
    marginTop: 22,
    alignItems: "center",
  },

  stepDot: {
    width: 20,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginRight: 6,
  },

  stepDone: {
    backgroundColor: "rgba(255,255,255,0.55)",
  },

  stepActive: {
    width: 32,
    backgroundColor: "#fff",
  },

  headerTitle: {
    color: "#fff",
    fontFamily: Typography.fontFamily.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.8,
    marginTop: 14,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
    fontFamily: Typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },

  fieldWrapper: {
    marginBottom: 24,
  },

  label: {
    color: "#111827",
    marginBottom: 9,

    fontFamily: Typography.fontFamily.medium,

    fontSize: 14,
    lineHeight: 20,

    letterSpacing: 0.2,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#d7dbe2",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#111827",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
    includeFontPadding: false,
    textAlignVertical: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 1,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
  },

  selectedChip: {
    borderColor: "#e0377a",
    backgroundColor: "rgba(224,55,122,0.08)",
  },

  chipText: {
    color: "#4b5563",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  selectedChipText: {
    color: "#e0377a",
    fontFamily: Typography.fontFamily.bold,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderColor: "#f3e8ef",
    backgroundColor: "#fff7fb",
  },

  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#e0377a",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  inputError: {
    borderColor: "#f87171",
    backgroundColor: "#fffafa",
  },
  otherTypeWrapper: {
    marginTop: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 16,
  },
});
