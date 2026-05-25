import { API_CONFIG } from "@/config/api";
import { Typography } from "@/theme/typography";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ProgressHeader from "@/components/ProgressHeader";

type Plan = {
  id: string;
  title: string;
  price: string;
  currency: string;
  symbol:string;
  subtitle: string;
  icon: string;
  duration_months:number;
  features: string[];
};

export default function ChoosePlanScreen() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(API_CONFIG.PLANS);

      const data = await response.json();

      setPlans(data);
    } catch (error) {
      console.log(error);
    }
  };

const handleContinue = async () => {
  try {
    if (!selectedPlan) {
      return;
    }

    // SAVE SELECTED PLAN
    const planData = {
      plan_name: selectedPlan.title,
      plan_id: selectedPlan.id,
      symbol:selectedPlan.symbol,
      currency:selectedPlan.currency,
      payment_amount: Number(
        selectedPlan.price
      ),
    };

    await SecureStore.setItemAsync(
      "selected_plan",
      JSON.stringify(planData)
    );

    // GET TOKEN + SHOP ID
    const token =
      await SecureStore.getItemAsync(
        "token"
      );

    const shopId =
      await SecureStore.getItemAsync(
        "shop_id"
      );

    if (!token || !shopId) {
      return;
    }

    // CREATE POLICY
    const response = await fetch(
      API_CONFIG.CREATE_POLICY,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          shop_id: shopId,

          plan_name:
            selectedPlan.title,

          plan_id:
            selectedPlan.id,

          payment_amount: Number(
            selectedPlan.price
          ),

          duration_months:
            selectedPlan.duration_months,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      return;
    }

    // SAVE POLICY ID
    await SecureStore.setItemAsync(
      "policy_id",
      String(data.policy.id)
    );

    // NEXT SCREEN
    router.push("/payment-screen");

  } catch (error) {
    console.log(error);
  }
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <ProgressHeader
        step={2}
        title="Choose your plan"
        subtitle="Select the protection plan that fits your business"
      />

      {/* BODY */}
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>AVAILABLE PLANS</Text>

       {plans.map((plan) => {
        const selected = selectedPlan?.id === plan.id;

        return (
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.92}
            style={[
              styles.planCard,
              selected && styles.selectedPlanCard,
            ]}
            onPress={() => setSelectedPlan(plan)}
          >
              {/* TOP */}
              <View style={styles.planTop}>
                <View
                  style={[styles.planIcon, selected && styles.selectedPlanIcon]}
                >
                  <Text style={styles.planEmoji}>{plan.icon}</Text>
                </View>

                <View style={styles.planContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.planTitle}>{plan.title}</Text>

                    <Text style={styles.planPrice}>
                     {plan.symbol}{plan.price}
                      <Text style={styles.planMonth}>/year</Text>
                    </Text>
                  </View>

                  <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                </View>

                <View style={[styles.radio, selected && styles.radioActive]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </View>

              {/* DIVIDER */}
              <View style={styles.divider} />

              {/* FEATURES */}
              {plan.features.map((item) => (
                <View key={item} style={styles.featureRow}>
                  <Text style={styles.check}>✓</Text>

                  <Text style={styles.featureText}>{item}</Text>
                </View>
              ))}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue →</Text>
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
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },

  sectionTitle: {
    color: "#64748b",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 18,
  },

  planCard: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 26,
    padding: 20,
    marginBottom: 18,
  },

  selectedPlanCard: {
    borderColor: "#f3a3c5",
    backgroundColor: "#fff3f8",
  },

  planTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  planIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#ea4c89",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  selectedPlanIcon: {
    backgroundColor: "#15b8a6",
  },

  planEmoji: {
    fontSize: 28,
  },

  planContent: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  planTitle: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
    letterSpacing: -0.7,
  },

  planPrice: {
    color: "#e0377a",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 22,
  },

  planMonth: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 15,
  },

  planSubtitle: {
    color: "#6b7280",
    marginTop: 4,
    fontFamily: Typography.fontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
  },

  radio: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#d1d5db",
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  radioActive: {
    borderColor: "#e0377a",
  },

  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#e0377a",
  },

  divider: {
    height: 1,
    backgroundColor: "#eceff3",
    marginVertical: 18,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  check: {
    color: "#10b981",
    fontSize: 18,
    marginRight: 10,
    fontFamily: Typography.fontFamily.bold,
  },

  featureText: {
    flex: 1,
    color: "#4b5563",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
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
    height: 58,
    borderRadius: 18,
    backgroundColor: "#e0377a",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
