import { API_CONFIG, STRIPE_CONFIG } from "@/config/api";
import ProgressHeader from "@/components/ProgressHeader";
import { Typography } from "@/theme/typography";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  StripeProvider,
  usePaymentSheet,
} from "@stripe/stripe-react-native";

function PaymentScreenContent() {
  const [loading, setLoading] = useState(false);

  const [plan, setPlan] = useState<any>(null);

  const { initPaymentSheet, presentPaymentSheet } =
    usePaymentSheet();

  useEffect(() => {
    getPlan();
  }, []);

  const getPlan = async () => {
    const savedPlan =
      await SecureStore.getItemAsync("selected_plan");

    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    }
  };

    const fetchPaymentSheetParams = async () => {
    try {
        const token =
        await SecureStore.getItemAsync("token");

        const policyId =
        await SecureStore.getItemAsync("policy_id");

        const response = await fetch(
        API_CONFIG.CREATE_PAYMENT,
        {
            method: "POST",

            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
            policy_id: policyId,
            }),
        }
        );

        const data = await response.json();

        if (!response.ok) {
        Alert.alert(
            "Error",
            data.message || "Payment failed"
        );

        return null;
        }

        return {
        clientSecret: data.client_secret,

        paymentIntentId:
            data.payment_intent_id,
        };
    } catch (error) {
        console.log(error);

        Alert.alert(
        "Error",
        "Something went wrong"
        );

        return null;
    }
    };

const initializePaymentSheet = async () => {

  const paymentData =
    await fetchPaymentSheetParams();

  if (!paymentData) {
    return false;
  }

  const { error } = await initPaymentSheet({
    merchantDisplayName: "Dooro",

    paymentIntentClientSecret:
      paymentData.clientSecret,

    allowsDelayedPaymentMethods: true,

    defaultBillingDetails: {
      name: "Customer",
    },
    googlePay: {
    merchantCountryCode: "GB",
    currencyCode: "GBP",
    testEnv: true,
    },
    appearance: {
      colors: {
        primary: "#e0377a",
        background: "#fff7fb",
        componentBackground: "#ffffff",
        componentBorder: "#f3d5e3",
        componentText: "#111827",
        primaryText: "#111827",
        secondaryText: "#6b7280",
        placeholderText: "#9ca3af",
        icon: "#e0377a",
      },

      shapes: {
        borderRadius: 18,

        shadow: {
          opacity: 0,
        },
      },
    },

    returnURL:
      "com.app.dooro://stripe-redirect",
  });

  if (error) {
    Alert.alert(error.code, error.message);

    return false;
  }

  return paymentData;
};



const openPaymentSheet = async () => {
  try {
    setLoading(true);

    const paymentData =
      await initializePaymentSheet();

    if (!paymentData) {
      return;
    }

    const { error } =
      await presentPaymentSheet();

    const token =
      await SecureStore.getItemAsync("token");

    const policyId =
      await SecureStore.getItemAsync("policy_id");

    // FAILED
    if (error) {

      await fetch(
        API_CONFIG.PAYMENT_FAILED,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            policy_id: policyId,
          }),
        }
      );

      Alert.alert(
        "Payment Failed",
        error.message
      );

      return;
    }

    // SUCCESS
    await fetch(
      API_CONFIG.PAYMENT_SUCCESS,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          policy_id: policyId,

          payment_intent_id:
            paymentData.paymentIntentId,
        }),
      }
    );

    Alert.alert(
      "Payment Successful",
      "Your insurance policy has been activated."
    );

    //router.replace("/success");

  } catch (error) {

    console.log(error);

    Alert.alert(
      "Error",
      "Something went wrong"
    );

  } finally {

    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ProgressHeader
        step={3}
        title="Complete payment"
        subtitle="Secure your shutter insurance instantly"
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🛡️</Text>
          </View>

          <Text style={styles.summaryTitle}>
            Policy Summary
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Plan</Text>

            <Text style={styles.value}>
              {plan?.plan_name}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Coverage Duration
            </Text>

            <Text style={styles.value}>
              1 Year
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total Amount
            </Text>

            <Text style={styles.totalAmount}>
              £{plan?.payment_amount}
            </Text>
          </View>
        </View>

        {/* PAYMENT METHODS */}
        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>
            Accepted Payment Methods
          </Text>

          <View style={styles.methodRow}>
            <View style={styles.method}>
              <Text style={styles.methodText}>
                💳 Cards
              </Text>
            </View>

            <View style={styles.method}>
              <Text style={styles.methodText}>
                🍎 Apple Pay
              </Text>
            </View>

            <View style={styles.method}>
              <Text style={styles.methodText}>
                🟢 Google Pay
              </Text>
            </View>
          </View>

          <Text style={styles.note}>
            All payments are encrypted and securely
            processed by Stripe.
          </Text>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.payButton}
          onPress={openPaymentSheet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay £{plan?.payment_amount}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PaymentScreen() {
  return (
    <StripeProvider
        publishableKey={STRIPE_CONFIG.publishableKey}
        merchantIdentifier="merchant.com.app.dooro"
        urlScheme="com.app.dooro"
    >
      <PaymentScreenContent />
    </StripeProvider>
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

  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#f3d5e3",
  },

  iconWrap: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: "#e0377a",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 18,
  },

  icon: {
    fontSize: 34,
  },

  summaryTitle: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 26,
    letterSpacing: -0.7,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  label: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 15,
  },

  value: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 18,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
  },

  totalAmount: {
    color: "#e0377a",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 28,
    letterSpacing: -1,
  },

  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#f3d5e3",
    marginTop: 20,
  },

  paymentTitle: {
    color: "#111827",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    marginBottom: 18,
  },

  methodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  method: {
    backgroundColor: "#fff3f8",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  methodText: {
    color: "#e0377a",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 14,
  },

  note: {
    color: "#6b7280",
    fontFamily: Typography.fontFamily.medium,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 20,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: "#f3e8ef",
    backgroundColor: "#fff7fb",
  },

  payButton: {
    height: 60,
    borderRadius: 20,
    backgroundColor: "#e0377a",
    justifyContent: "center",
    alignItems: "center",
  },

  payButtonText: {
    color: "#fff",
    fontFamily: Typography.fontFamily.bold,
    fontSize: 17,
    letterSpacing: 0.2,
  },
});