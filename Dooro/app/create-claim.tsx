import AppHeader from "@/components/AppHeader";
import { API_CONFIG } from "@/config/api";
import { Typography } from "@/theme/typography";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

import { router, useLocalSearchParams } from "expo-router";

import { useState } from "react";

import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateClaimScreen() {
  // ✅ POLICY DATA FROM PROPS / ROUTE PARAMS
  const { policy_id, policy_number, shop_name } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const [claimReason, setClaimReason] = useState("");

  const [incidentDate, setIncidentDate] = useState("");

  const [description, setDescription] = useState("");

  const [images, setImages] = useState<any[]>([]);

  /*
  |--------------------------------------------------------------------------
  | PICK IMAGES
  |--------------------------------------------------------------------------
  */

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow gallery access");

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsMultipleSelection: true,

      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE IMAGE
  |--------------------------------------------------------------------------
  */

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT CLAIM API
  |--------------------------------------------------------------------------
  */

  const submitClaim = async () => {
    if (!claimReason || !incidentDate || !description) {
      Alert.alert("Missing Details", "Please complete all required fields");

      return;
    }

    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync("token");

      const formData = new FormData();

      formData.append("policy_id", String(policy_id));

      formData.append("reason", claimReason);

      formData.append("description", description);

      formData.append("incident_date", incidentDate);

      // ✅ IMAGES
      images.forEach((img, index) => {
        formData.append("images[]", {
          uri: img.uri,
          name: `claim_${index}.jpg`,
          type: "image/jpeg",
        } as any);
      });

      const response = await fetch(API_CONFIG.CREATE_CLAIM, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      
      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Claim submission failed");

        return;
      }

      Alert.alert(
        "Success",
        "Your insurance claim has been submitted successfully."
      );

      router.back();
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

      <AppHeader
        title="File a Claim"
        subtitle="Quick & secure claim process"
        rightIcon="home-outline"
        onRightPress={() => router.replace("/home")}
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* POLICY CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Selected Policy</Text>

          <View style={styles.selectedPolicyCard}>
            <View style={styles.policyRow}>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.policyNumber}>
                  #{policy_number}
                </Text>

                <Text style={styles.policyShop}>{shop_name}</Text>
              </View>

              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CLAIM TYPE */}
        <View style={styles.card}>
          <Text style={styles.label}>Claim Reason</Text>

          <View style={styles.reasonGrid}>
            {["Shutter Damage", "Fire Damage", "Theft"].map((item) => {
              const active = claimReason === item;

              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.85}
                  style={[styles.reasonChip, active && styles.reasonChipActive]}
                  onPress={() => setClaimReason(item)}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      active && styles.reasonTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* INCIDENT DATE */}
        <View style={styles.card}>
          <Text style={styles.label}>Incident Date</Text>

          <TextInput
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#9ca3af"
            value={incidentDate}
            onChangeText={setIncidentDate}
            style={styles.input}
          />
        </View>

        {/* DESCRIPTION */}
        <View style={styles.card}>
          <Text style={styles.label}>Describe the incident</Text>

          <TextInput
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder="Explain what happened..."
            placeholderTextColor="#9ca3af"
            style={[styles.input, styles.textArea]}
          />
        </View>

        {/* IMAGE UPLOAD */}
        <View style={styles.card}>
          <View style={styles.uploadHeader}>
            <Text style={styles.label}>Upload Evidence</Text>

            <Text style={styles.uploadSub}>Multiple images supported</Text>
          </View>

          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.85}
            onPress={pickImages}
          >
            <Ionicons name="cloud-upload-outline" size={34} color="#e0377a" />

            <Text style={styles.uploadTitle}>Upload Photos</Text>

            <Text style={styles.uploadText}>High Quality Damage photos</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageRow}
            >
              {images.map((img, index) => (
                <View key={index} style={styles.imageWrap}>
                  <Image source={{ uri: img.uri }} style={styles.preview} />

                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeImage(index)}
                  >
                    <MaterialIcons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* INFO CARD */}
        <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={22} color="#e0377a" />

          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Claim Review Time</Text>

            <Text style={styles.infoText}>
              Claims are usually reviewed within 24 hours by our support team.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.9}
          onPress={submitClaim}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? "Submitting..." : "Submit Claim"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
  },

  body: {
    padding: 20,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  label: {
    color: "#111827",
    fontSize: 15,
    marginBottom: 14,
    fontFamily: Typography.fontFamily.bold,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#eceff3",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: "#111827",
    fontSize: 15,
    fontFamily: Typography.fontFamily.medium,
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  /*
  |--------------------------------------------------------------------------
  | POLICY CARD
  |--------------------------------------------------------------------------
  */

  policyCard: {
    borderWidth: 1,
    borderColor: "#f3d5e3",
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#fff7fb",
  },

  policyTitle: {
    color: "#e0377a",
    fontSize: 16,
    fontFamily: Typography.fontFamily.bold,
  },

  policySub: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
  },

  /*
  |--------------------------------------------------------------------------
  | CLAIM REASON
  |--------------------------------------------------------------------------
  */

  reasonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  reasonChip: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
  },

  reasonChipActive: {
    backgroundColor: "#ffe4ef",
  },

  reasonText: {
    color: "#4b5563",
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
  },

  reasonTextActive: {
    color: "#e0377a",
    fontFamily: Typography.fontFamily.bold,
  },

  /*
  |--------------------------------------------------------------------------
  | IMAGE UPLOAD
  |--------------------------------------------------------------------------
  */

  uploadHeader: {
    marginBottom: 14,
  },

  uploadSub: {
    color: "#6b7280",
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
  },

  uploadBox: {
    borderWidth: 1.5,
    borderColor: "#f3d5e3",
    borderStyle: "dashed",
    borderRadius: 22,
    paddingVertical: 32,
    alignItems: "center",
    backgroundColor: "#fff7fb",
  },

  uploadTitle: {
    color: "#111827",
    marginTop: 10,
    fontSize: 16,
    fontFamily: Typography.fontFamily.bold,
  },

  uploadText: {
    color: "#6b7280",
    marginTop: 6,
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
  },

  imageRow: {
    paddingTop: 18,
    gap: 12,
  },

  imageWrap: {
    position: "relative",
  },

  preview: {
    width: 100,
    height: 100,
    borderRadius: 18,
  },

  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  /*
  |--------------------------------------------------------------------------
  | INFO CARD
  |--------------------------------------------------------------------------
  */

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  infoTitle: {
    color: "#111827",
    fontSize: 15,
    marginBottom: 4,
    fontFamily: Typography.fontFamily.bold,
  },

  infoText: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Typography.fontFamily.medium,
  },

  /*
  |--------------------------------------------------------------------------
  | FOOTER
  |--------------------------------------------------------------------------
  */

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    backgroundColor: "#f8f7ff",
    borderTopWidth: 1,
    borderColor: "#f1f1f1",
  },

  submitBtn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#e0377a",
    justifyContent: "center",
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Typography.fontFamily.bold,
  },

  selectedPolicyCard: {
    backgroundColor: "#fff7fb",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f6d3e2",
  },

  policyRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  policyNumber: {
    color: "#111827",
    fontSize: 15,
    fontFamily: Typography.fontFamily.bold,
    marginRight: 10,
  },

  policyShop: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
  },

  activeBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginLeft: 10,
  },

  activeBadgeText: {
    color: "#15803d",
    fontSize: 11,
    fontFamily: Typography.fontFamily.bold,
  },
});
