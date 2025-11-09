import { View, Text, StyleSheet, useColorScheme, Platform } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { Colors } from "../../constants/Colors";
import Spacer from "../../components/Spacer";
import ThemedBox from "../../components/ThemedBox";
import ThemedView from "../../components/newThemedView";
import { useAuthedContext } from "../../contexts/AuthContext";

export default function TabLayout() {
  const { authedUser, authedUserLoading } = useAuthedContext();
  const isAuthenticated = authedUser.email !== "error";
  const colorScheme: any = useColorScheme();
  const theme = Colors[colorScheme];
  return (
    <ThemedView
      style={[styles.screen, { backgroundColor: theme.layoutBackground }]}
    >
      <Spacer
        height={100}
        style={{ backgroundColor: theme.layoutBackground }}
      />
      <View
        style={[styles.header, { backgroundColor: theme.layoutBackground }]}
      >
        <View>
          <Text style={styles.headerTitle}>Hi, Damyan!</Text>
          <Text style={{ fontSize: 14, color: Colors.text.light }}>
            Ready? Get set. Sweat. Repeat!
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>D</Text>
        </View>
      </View>

      <Spacer height={50} style={{ backgroundColor: theme.layoutBackground }} />

      <View style={[styles.shadowWrapper, Colors.dark.shadow]}>
        <ThemedBox style={[styles.contentContainer]}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: theme.textPrimary,
              tabBarStyle: [
                styles.tabBar,
                theme.shadow,
                { backgroundColor: theme.background },
              ],
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color }: { color: string }) => (
                  <Entypo name="home" size={24} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="qrcode"
              options={{
                title: "QR Code",
                tabBarIcon: ({ color }: { color: string }) => (
                  <AntDesign name="qrcode" size={24} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="menu"
              options={{
                title: "Menu",
                tabBarIcon: ({ color }: { color: string }) => (
                  <MaterialCommunityIcons name="menu" size={24} color={color} />
                ),
              }}
            />
          </Tabs>
        </ThemedBox>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.light,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.light,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  shadowWrapper: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "transparent", // don’t block shadow
  },
  tabBar: {
    borderTopWidth: 0,
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});
