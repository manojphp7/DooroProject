import AppHeader from "@/components/AppHeader";
import { API_CONFIG } from "@/config/api";
import { Typography } from "@/theme/typography";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

import { router } from "expo-router";

import { useEffect, useState } from "react";

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

export default function ClaimScreen() {
  const [policies, setPolicies] = useState<any[]>([]);

  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [claimReason, setClaimReason] = useState("");

  const [incidentDate, setIncidentDate] = useState("");

  const [description, setDescription] = useState("");

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const response = await fetch(`${API_CONFIG.MY_POLICIES}?status=active`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data.policies.length);
      if (!response.ok) {
        return;
      }

      setPolicies(data.policies || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
      const selected = result.assets.map((item) => item.uri);

      setImages((prev) => [...prev, ...selected]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitClaim = async () => {
    if (!selectedPolicy || !claimReason || !incidentDate || !description) {
      Alert.alert("Missing Details", "Please complete all required fields");

      return;
    }

    Alert.alert(
      "Claim Submitted",
      "Your insurance claim has been submitted successfully."
    );

    router.back();
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
        {/* ACTIVE POLICY */}
        <View style={styles.card}>
          <Text style={styles.label}>Select Active Policy</Text>

          {loading ? (
            <Text style={styles.emptyText}>Loading policies...</Text>
          ) : policies.length === 0 ? (
            <Text style={styles.emptyText}>No active policies found</Text>
          ) : (
            <ScrollView
              style={styles.policyScroll}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.policyWrap}
            >
              {policies.map((item) => {
                const active = selectedPolicy?.id === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.85}
                    style={[
                      styles.policyCard,
                      active && styles.policyCardActive,
                    ]}
                    onPress={() => setSelectedPolicy(item)}
                  >
                    <Text
                      style={[
                        styles.policyTitle,
                        active && styles.policyTitleActive,
                      ]}
                    >
                      {item.policy_number}
                    </Text>

                    <Text style={styles.policySub}>{item.shop_name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
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
                  <Image source={{ uri: img }} style={styles.preview} />

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
              Claims are usually reviewed within 24-48 hours by our support
              team.
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
        >
          <Text style={styles.submitText}>Submit Claim</Text>
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

  policyWrap: {
    gap: 12,
  },

  policyCard: {
    borderWidth: 1,
    borderColor: "#eceff3",
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#f9fafb",
  },

  policyCardActive: {
    borderColor: "#e0377a",
    backgroundColor: "#fff1f7",
  },

  policyTitle: {
    color: "#111827",
    fontSize: 15,
    fontFamily: Typography.fontFamily.bold,
  },

  policyTitleActive: {
    color: "#e0377a",
  },

  policySub: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
  },

  emptyText: {
    color: "#6b7280",
    fontSize: 14,
    fontFamily: Typography.fontFamily.medium,
  },

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
  policyScroll: {
    maxHeight: 260,
  },
});
