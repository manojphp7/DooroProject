import { Typography } from "@/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  title: string;
  subtitle?: string;

  showBack?: boolean;
  showHome?: boolean;

  rightIcon?: keyof typeof Ionicons.glyphMap;

  onRightPress?: () => void;
};

export default function AppHeader({
  title,
  subtitle,

  showBack = true,
  showHome = false,

  rightIcon,
  onRightPress,
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
      <View style={styles.topRow}>
        <View style={styles.leftActions}>
          {showBack && (
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.85}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          )}

          {showHome && (
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.85}
              onPress={() => router.replace("/home")}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.contentRow}>
        <View style={{ flex: 1 }}>
          {!!subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}

          <Text style={styles.title}>
            {title}
          </Text>
        </View>

        {!!rightIcon && (
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={onRightPress}
          >
            <Ionicons
              name={rightIcon}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 185, // FIXED HEIGHT
    paddingTop: 50,
    paddingHorizontal: 22,
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
    height: 40,
    justifyContent: "center",
  },

  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  contentRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 24,
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
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontFamily: Typography.fontFamily.regular,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  actionButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
});