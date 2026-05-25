import AppHeader from "@/components/AppHeader";
import { API_CONFIG } from "@/config/api";
import { Typography } from "@/theme/typography";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";

export default function MyClaimsScreen() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const res = await fetch(API_CONFIG.GET_CLAIMS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      console.log("CLAIMS:", data);

      if (data?.success) {
        setClaims(data.claims || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#16a34a";
      case "rejected":
        return "#dc2626";
      case "processing":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.rowBetween}>
          <Text style={styles.claimNo}>{item.claim_number}</Text>

          <Text
            style={[
              styles.status,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            {item.status}
          </Text>
        </View>

        {/* SHOP + POLICY */}
        <Text style={styles.shop}>
          {item.shop?.shop_name}
        </Text>

        <Text style={styles.policy}>
          Policy: {item.policy?.policy_number}
        </Text>

        {/* IMAGES */}
        {item.images?.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.images.map((img: string, index: number) => (
              <Image key={index} source={{ uri: img }} style={styles.image} />
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <AppHeader
        title="My Claims"
        subtitle="All your insurance claims"
      />

      <FlatList
        data={claims}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.body}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No claims found</Text>
          ) : (
            <Text style={styles.empty}>Loading...</Text>
          )
        }
      />
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
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  claimNo: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.bold,
    color: "#111827",
  },

  status: {
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    textTransform: "capitalize",
  },

  shop: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
  },

  policy: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 10,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 8,
  },

  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
  },
});