import { API_CONFIG } from "@/config/api";
import ProgressHeader from "@/components/ProgressHeader";
import { Typography } from "@/theme/typography";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Policy = {
  id: number;
  shop_name: string;
  plan_name: string;
  payment_amount: string;
  payment_status: string;
  created_at?: string;
};

export default function PoliciesScreen() {
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token =
        await SecureStore.getItemAsync("token");

      const response = await fetch(
        API_CONFIG.MY_POLICIES,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

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

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchPolicies();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "success":
        return {
          bg: "#dcfce7",
          text: "#15803d",
          label: "Active",
        };

      case "failed":
        return {
          bg: "#fee2e2",
          text: "#dc2626",
          label: "Failed",
        };

      default:
        return {
          bg: "#fef3c7",
          text: "#d97706",
          label: "Pending",
        };
    }
  };

  const renderPolicy = ({ item }: { item: Policy }) => {
    const status = getStatusStyle(
      item.payment_status
    );

    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🛡️</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.shopName}>
              {item.shop_name}
            </Text>

            <Text style={styles.planName}>
              {item.plan_name}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: status.bg,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: status.text,
                },
              ]}
            >
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.label}>
              Coverage
            </Text>

            <Text style={styles.value}>
              1 Year
            </Text>
          </View>

          <View>
            <Text style={styles.label}>
              Amount Paid
            </Text>

            <Text style={styles.amount}>
              £{item.payment_amount}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#e0377a"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ProgressHeader
        step={3}
        title="My Policies"
        subtitle="Manage your shutter insurance policies"
      />

      <FlatList
        data={policies}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={renderPolicy}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#e0377a"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>
              📄
            </Text>

            <Text style={styles.emptyTitle}>
              No Policies Found
            </Text>

            <Text style={styles.emptyText}>
              Your purchased insurance policies
              will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7fb",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff7fb",
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#f3d5e3",
    marginBottom: 18,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#e0377a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  icon: {
    fontSize: 30,
  },

  content: {
    flex: 1,
  },

  shopName: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    letterSpacing: -0.5,
  },

  planName: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 14,
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  statusText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 12,
    letterSpacing: 0.3,
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 20,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    marginBottom: 6,
  },

  value: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
  },

  amount: {
    color: "#e0377a",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 24,
    letterSpacing: -0.8,
  },

  emptyWrap: {
    alignItems: "center",
    marginTop: 100,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 52,
    marginBottom: 18,
  },

  emptyTitle: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 22,
    marginBottom: 10,
  },

  emptyText: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
  },
});

