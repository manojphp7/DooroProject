import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { logout } from "@/utils/logout";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await SecureStore.getItemAsync("user");

        if (data) {
          const parsed = JSON.parse(data);
          console.log("Home Screen");
          console.log(parsed);
          setUser(parsed); // 👈 important
        }
      } catch (err) {
        console.log("USER LOAD ERROR:", err);
      }
    };

    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <AppHeader
        title={user?.name ?? "Dooro"}
        subtitle="Welcome Back 👋"
        showBack={false}
        rightIcon="add"
        onRightPress={() => router.push("/shop-details")}
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => router.push("/policies-screen")}
          >
            <LinearGradient
              colors={["#c42d6a", "#e8558e"]}
              style={styles.actionIconWrap}
            >
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={22}
                color="#fff"
              />
            </LinearGradient>

            <Text style={styles.actionTitle}>My Policies</Text>
            <Text style={styles.actionSub}>View insurance details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => router.push("/shop-details")}
          >
            <LinearGradient
              colors={["#c42d6a", "#e8558e"]}
              style={styles.actionIconWrap}
            >
              <MaterialCommunityIcons
                name="storefront-outline"
                size={22}
                color="#fff"
              />
            </LinearGradient>

            <Text style={styles.actionTitle}>Create Policy</Text>
            <Text style={styles.actionSub}>Protect Another Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => router.push("/claim-screen")}
          >
            <LinearGradient
              colors={["#c42d6a", "#e8558e"]}
              style={styles.actionIconWrap}
            >
              <Feather name="file-text" size={22} color="#fff" />
            </LinearGradient>

            <Text style={styles.actionTitle}>Claims</Text>
            <Text style={styles.actionSub}>Track your claim status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => {}}
          >
            <LinearGradient
              colors={["#c42d6a", "#e8558e"]}
              style={styles.actionIconWrap}
            >
              <Ionicons name="call-outline" size={22} color="#fff" />
            </LinearGradient>

            <Text style={styles.actionTitle}>Support</Text>
            <Text style={styles.actionSub}>Get instant help</Text>
          </TouchableOpacity>

       
        </View>

        {/* Coverage */}
        <Text style={styles.sectionTitle}>Coverage Benefits</Text>

        <View style={styles.coverageCard}>
          <View style={styles.coverageRow}>
            <MaterialCommunityIcons
              name="shield-home-outline"
              size={24}
              color="#c42d6a"
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.coverageTitle}>Shutter Damage</Text>
              <Text style={styles.coverageText}>
                Protection against accidental or forced shutter damage.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.coverageRow}>
            <MaterialCommunityIcons
              name="fire-alert"
              size={24}
              color="#c42d6a"
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.coverageTitle}>Fire Protection</Text>
              <Text style={styles.coverageText}>
                Coverage for fire-related losses and damage.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.coverageRow}>
            <MaterialCommunityIcons
              name="cash-refund"
              size={24}
              color="#c42d6a"
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.coverageTitle}>Quick Claim Support</Text>
              <Text style={styles.coverageText}>
                Faster settlement process with 24/7 support.
              </Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("/claim-screen")}>
          <LinearGradient
            colors={["#c42d6a", "#e8558e"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaBtn}
          >
            <Text style={styles.ctaText}>File a New Claim</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcome: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },

  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },

  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  policyCard: {
    marginTop: 26,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  policyLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginBottom: 4,
  },

  policyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  policyBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },

  policyBadgeText: {
    color: "#c42d6a",
    fontSize: 11,
    fontWeight: "700",
  },

  body: {
    padding: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3a0a1e",
    marginBottom: 14,
    marginTop: 10,
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  actionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3a0a1e",
    marginBottom: 4,
  },

  actionSub: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
  },

  coverageCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 26,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  coverageRow: {
    flexDirection: "row",
    gap: 14,
  },

  coverageTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3a0a1e",
    marginBottom: 4,
  },

  coverageText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f1f1",
    marginVertical: 16,
  },

  ctaBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
