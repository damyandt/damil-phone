import {
  Stack,
  SplashScreen,
  useRootNavigationState,
  router,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import AuthContext, { useAuthedContext } from "../contexts/AuthContext";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { deleteCookie } from "../Global/Utils/commonFunctions";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "../constants/auth";

SplashScreen.preventAutoHideAsync();

function AuthWrapper() {
  const { authedUser, authedUserLoading } = useAuthedContext();
  const isAuthenticated = authedUser && authedUser.email !== "error";

  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    if (authedUserLoading) {
      return;
    }

    SplashScreen.hideAsync();

    if (!isAuthenticated) {
      deleteCookie(COOKIE_REFRESH_TOKEN);
      deleteCookie(COOKIE_ACCESS_TOKEN);
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, authedUserLoading, rootNavigationState?.key]);
  if (authedUserLoading || !rootNavigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Checking Authentication...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthContext>
      <StatusBar style="light" />
      <AuthWrapper />
    </AuthContext>
  );
}
