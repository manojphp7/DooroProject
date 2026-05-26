import AppHeader from "@/components/AppHeader";
import { API_CONFIG } from "@/config/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ClaimDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [claim, setClaim] = useState<any>(null);

  useEffect(() => {
    fetchClaimDetail();
  }, []);

  const fetchClaimDetail = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const response = await fetch(`${API_CONFIG.CLAIM_DETAIL}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
if (data?.claim?.images) {
  console.log("IMAGES:", data.claim.images);
} else {
  console.log("No images found");
}
      //console.log("CLAIM DETAIL =>", data);

      if (data.claim) {
        setClaim(data.claim);
      }
    } catch (error) {
      console.log("Claim detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c42d6a" />
      </View>
    );
  }

  if (!claim) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Claim not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Claim Details"
        subtitle={claim.claim_number}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
      >
        {/* POLICY INFO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Policy Information
          </Text>

          <InfoRow
            icon="description"
            label="Policy Number"
            value={claim.policy?.policy_number}
          />

          <InfoRow
            icon="verified-user"
            label="Plan Name"
            value={claim.policy?.plan_name}
          />

          <InfoRow
            icon="store"
            label="Shop Name"
            value={claim.shop?.shop_name}
          />

          <InfoRow
            icon="location-on"
            label="Shop Address"
            value={claim.shop?.address}
          />
        </View>

        {/* CLAIM INFO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Claim Information
          </Text>

          <InfoRow
            icon="warning"
            label="Reason"
            value={claim.reason}
          />

          <InfoRow
            icon="calendar-month"
            label="Incident Date"
            value={claim.incident_date}
          />

          <InfoRow
            icon="info"
            label="Status"
            value={claim.status}
          />

          <View style={styles.divider} />

          <Text style={styles.label}>Description</Text>

          <Text style={styles.description}>
            {claim.description || "No description available"}
          </Text>
        </View>

        {/* CLAIM IMAGES */}
        {claim.images?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Claim Images
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {claim.images.map(
                (img: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => Linking.openURL(img.image)}
                  >
                    <Image
                      source={{
                        uri: img.image,
                      }}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                )
              )}
            </ScrollView>

            <Text style={styles.imageHint}>
              Tap image to open/download
            </Text>
          </View>
        )}

        {/* ADMIN NOTES */}
        {claim.admin_notes ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Admin Notes
            </Text>

            <Text style={styles.description}>
              {claim.admin_notes}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconWrap}>
        <MaterialIcons
          name={icon}
          size={20}
          color="#c42d6a"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>

        <Text style={styles.value}>
          {value || "N/A"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f7ff",
  },

  body: {
    padding: 20,
    paddingBottom: 40,
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

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3a0a1e",
    marginBottom: 18,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 18,
    alignItems: "center",
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#fff1f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  label: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3a0a1e",
    textTransform: "capitalize",
  },

  description: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 24,
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f1f1",
    marginVertical: 16,
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: "#f3f4f6",
  },

  imageHint: {
    marginTop: 12,
    fontSize: 12,
    color: "#9ca3af",
  },
});