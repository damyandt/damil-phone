// // import { Stack } from "expo-router";
// // import { StatusBar } from "expo-status-bar";
// // import AuthContext, { useAuthedContext } from "../contexts/AuthContext";

// // export default function Layout() {
// //   const { authedUser, authedUserLoading } = useAuthedContext();
// //   if (authedUserLoading) {
// //     // You should use a better UI component here, or rely on the native splash screen
// //     return null;
// //   }
// //   const isAuthenticated =
// //     authedUser !== undefined && authedUser.email !== "error";

// //   return (
// //     <AuthContext>
// //       <StatusBar style="light" />
// //       <Stack>
// //         {isAuthenticated ? (
// //           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
// //         ) : (
// //           <Stack.Screen name="(auth)" options={{ headerShown: false }} />
// //         )}
// //       </Stack>
// //     </AuthContext>
// //   );
// // }

// // app/_layout.tsx

// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import AuthContext, { useAuthedContext } from "../contexts/AuthContext";
// import { Text, View } from "react-native";

// function AuthWrapper() {
//   const { authedUser, authedUserLoading } = useAuthedContext();
//   const isAuthenticated = authedUser.email !== "error";

//   if (authedUserLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Checking Authentication...</Text>
//       </View>
//     );
//   }
//   console.log(isAuthenticated);
//   if (isAuthenticated) {
//     return (
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="(tabs)" />
//       </Stack>
//     );
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(auth)" />
//     </Stack>
//   );
// }

// export default function Layout() {
//   return (
//     <AuthContext>
//       <StatusBar style="light" />
//       <AuthWrapper />
//     </AuthContext>
//   );
// }

// app/_layout.tsx

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
  console.log(isAuthenticated);
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
