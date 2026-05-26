import { API_CONFIG } from "@/config/api";
import AppHeader from "@/components/AppHeader";
import { Typography } from "@/theme/typography";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { router } from "expo-router";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Policy = {
  id: number;
  policy_number: string;
  status: string;
  payment_status: string;
  premium_amount: string;
  created_at?: string;

  plan: {
    id: number;
    title: string;
    symbol: string;
    duration_months: number;
  };

  shop: {
    id: number;
    shop_name: string;
  };
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
      const token = await SecureStore.getItemAsync("token");

      const response = await fetch(API_CONFIG.MY_POLICIES, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log(data);

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
      case "paid":
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
    const status = getStatusStyle(item.payment_status);

    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.policyCard}>
        {/* TOP */}
        <View style={styles.policyTop}>
          <View style={styles.policyIconWrap}>
            <Text style={styles.policyIcon}>{item.plan?.title}🛠️ 🛡️</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.shopName}>
              {item.shop?.shop_name}
            </Text>

            <Text style={styles.planName}>{item.plan?.title}</Text>
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

        {/* INFO */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Premium</Text>

            <Text style={styles.amount}>£{item.premium_amount}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Coverage</Text>

            <Text style={styles.infoValue}>
              {item.plan?.duration_months || 12} Months
            </Text>
          </View>
        </View>

        {/* POLICY NUMBER + CLAIM */}
        <View style={styles.policyBottomRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.policyLabel}>Policy Number</Text>

            <Text style={styles.policyNumber}>{item.policy_number}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.claimBtn}
            onPress={() =>
              router.push({
                pathname: "/create-claim",
                params: {
                  policy_id: item.id.toString(),
                  policy_number: item.policy_number,
                },
              })
            }
          >
            <Text style={styles.claimBtnText}>Create Claim</Text>
          </TouchableOpacity>
        </View>

        {/* DATE */}
        <View style={styles.dateRow}>
          <Text style={styles.dateIcon}>📅</Text>

          <Text style={styles.dateText}>
            Purchased on{" "}
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "--"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e0377a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <AppHeader
        title="My Policies"
        subtitle="Manage your policies"
        showBack={false}
        rightIcon="home-outline"
        onRightPress={() => router.replace("/home")}
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
            <Text style={styles.emptyIcon}>📄</Text>

            <Text style={styles.emptyTitle}>No Policies Found</Text>

            <Text style={styles.emptyText}>
              Your purchased insurance policies will appear here.
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
    backgroundColor: "#f8f7ff",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f7ff",
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  policyCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: "#f3dce7",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  policyTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  policyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#e0377a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  policyIcon: {
    fontSize: 26,
  },

  shopName: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 17,
    letterSpacing: -0.3,
  },

  planName: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  statusText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.3,
  },

  infoGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#fff5f9",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  infoLabel: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 12,
    marginBottom: 6,
  },

  infoValue: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
  },

  amount: {
    color: "#e0377a",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },

  policyBottomRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  policyLabel: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 12,
    marginBottom: 4,
  },

  policyNumber: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 14,
  },

  claimBtn: {
    backgroundColor: "#e0377a",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 14,
  },

  claimBtnText: {
    color: "#fff",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f5e6ee",
  },

  dateIcon: {
    fontSize: 14,
    marginRight: 8,
  },

  dateText: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 12.5,
  },

  emptyWrap: {
    alignItems: "center",
    marginTop: 120,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 56,
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
