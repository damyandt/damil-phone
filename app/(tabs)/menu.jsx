import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

export default function Menu() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const router = useRouter();

  const menuItems = [
    {
      title: "Profile Info",
      icon: "account-circle-outline",
      route: "/profile",
    },
    {
      title: "My Subscription",
      icon: "credit-card-outline",
      route: "/subscription",
    },
    {
      title: "Gym Information",
      icon: "dumbbell",
      route: "/gym-info",
    },
    {
      title: "Settings",
      icon: "cog-outline",
      route: "/settings",
    },
    {
      title: "Help & Support",
      icon: "help-circle-outline",
      route: "/support",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.layoutBackground }]}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* 👤 Profile Header */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: theme.surface, ...theme.shadow },
        ]}
      >
        <View style={styles.profileRow}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />
          <View style={styles.profileTextContainer}>
            <Text style={[styles.name, { color: theme.textPrimary }]}>
              Damyan
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              View your profile
            </Text>
          </View>
        </View>
      </View>

      {/* ⚙️ Menu List */}
      <View style={[styles.menuSection, { backgroundColor: theme.surface }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            activeOpacity={0.6}
            onPress={() => router.push(item.route)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={theme.textPrimary}
              style={{ width: 30 }}
            />
            <Text style={[styles.menuText, { color: theme.textPrimary }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🚪 Logout Button */}
      <TouchableOpacity
        style={styles.logoutContainer}
        activeOpacity={0.7}
        onPress={() => console.log("Log out")}
      >
        <MaterialCommunityIcons
          name="logout"
          size={22}
          color={theme.textPrimary}
        />
        <Text style={[styles.logoutText, { color: theme.textPrimary }]}>
          Log out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    marginTop: 60,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ccc",
  },
  profileTextContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  menuSection: {
    marginTop: 30,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginHorizontal: 20,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
});
