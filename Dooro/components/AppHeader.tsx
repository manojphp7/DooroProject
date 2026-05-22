import { Typography } from "@/theme/typography";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
};

export default function AppHeader({
  title,
  subtitle,
  showBack = true,
  rightAction,
}: Props) {
  return (
    <LinearGradient
      colors={["#c42d6a", "#e8558e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* TOP ROW */}


      {/* CONTENT */}
      <View style={styles.contentRow}>
        <View style={{ flex: 1 }}>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          <Text style={styles.title}>{title}</Text>
        </View>

        {rightAction}
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

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contentRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  title: {
    color: "#fff",
    fontFamily: Typography.fontFamily.bold,
    marginTop: 4,
    fontSize: 24,
  lineHeight: 30,
  letterSpacing: -0.3,
  },

  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: Typography.fontFamily.regular,
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
});
