import {
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { useAuthedContext } from "../../contexts/AuthContext";
import PageLayoutComponent from "../../components/PageLayoutComponent";
import ThemedBox from "../../components/ThemedBox";
import Spacer from "../../components/Spacer";
import { handleUserSignOut } from "../../contexts/authContextUtils";

interface MenuItem {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route?: string;
}

const Menu: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const { setAuthedUser } = useAuthedContext();

  const menuItemsGym: MenuItem[] = [
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
  ];

  const menuItemsProfile: MenuItem[] = [
    {
      title: "Profile Info",
      icon: "account-circle-outline",
      route: "/profile",
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

  const handlePress = (route?: string) => {
    if (route) router.push(route);
  };

  return (
    <PageLayoutComponent
      title="Settings"
      subTitle="Account and Gym Information"
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ThemedBox style={styles.menuSection}>
          {menuItemsGym.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: theme.surface }]}
              activeOpacity={0.6}
              onPress={() => handlePress(item.route)}
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

          <Spacer height={20} />

          {menuItemsProfile.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: theme.surface }]}
              activeOpacity={0.6}
              onPress={() => handlePress(item.route)}
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

          <Spacer height={20} />

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              handleUserSignOut(setAuthedUser);
              console.log("Log out");
              router.replace("/(auth)/login");
            }}
            style={[styles.menuItem, { backgroundColor: theme.surface }]}
          >
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color={theme.textPrimary}
              style={{ width: 30 }}
            />
            <Text style={[styles.menuText, { color: theme.textPrimary }]}>
              Log out
            </Text>
          </TouchableOpacity>
        </ThemedBox>
      </ScrollView>
    </PageLayoutComponent>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuSection: {
    marginTop: 30,
    marginHorizontal: 16,
    overflow: "hidden",
    display: "flex",
    gap: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
