import { Typography } from "@/theme/typography";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  step: number; // 0,1,2...
  totalSteps?: number; // default 3
  title: string;
  subtitle?: string;
  showBack?: boolean;
};

export default function ProgressHeader({
  step,
  totalSteps = 4,
  title,
  subtitle,
  showBack = true,
}: Props) {
  return (
    <LinearGradient
      colors={["#c42d6a", "#e8558e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* TOP BAR */}
      <View style={styles.headerTop}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}

        <Text style={styles.logo}>
          Dooro<Text style={styles.logoTm}>®</Text>
        </Text>
      </View>

      {/* STEP INDICATOR */}
      <View style={styles.stepRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.stepDot,
              i === step && styles.stepActive,
            ]}
          />
        ))}
      </View>

      {/* TITLE SECTION */}
      <View style={{ marginTop: 14 }}>
        <Text style={styles.headerTitle}>{title}</Text>

        {!!subtitle && (
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        )}
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },

  circle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -30,
    right: -20,
  },

  circle2: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: 0,
    left: -10,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: Typography.fontFamily.bold,
  },

  logo: {
    color: "#fff",
    fontSize: 28,
    fontFamily: Typography.fontFamily.bold,
  },

  logoTm: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
  },

  stepRow: {
    flexDirection: "row",
    marginTop: 18,
    gap: 6,
    alignItems: "center",
  },

  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  stepActive: {
    backgroundColor: "#fff",
    width: 18,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontFamily: Typography.fontFamily.bold,
    marginTop: 8,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: Typography.fontFamily.regular,
    marginTop: 4,
  },
});