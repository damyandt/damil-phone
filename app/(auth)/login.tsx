import React, { useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import LoginFormRN from "../../components/pages/LoginForm";
import { useAuthedContext } from "../../contexts/AuthContext";

const { height } = Dimensions.get("window");

const LoginPage = () => {
  const { setUserSignedIn } = useAuthedContext();
  const boxTranslateY = useSharedValue(0);
  const logoTranslateY = useSharedValue(0);
  const logoScale = useSharedValue(1);
  const isAnimating = useRef(false);

  const handleSuccessfulLogin = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    boxTranslateY.value = withTiming(height, { duration: 700 });

    logoTranslateY.value = withTiming(height / 2 - 150, { duration: 700 });
    logoScale.value = withTiming(1.5, { duration: 700 });

    setTimeout(() => {
      setUserSignedIn(false);
      setUserSignedIn(true);
    }, 500);
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 1000);
  };

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: boxTranslateY.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: logoTranslateY.value },
      { scale: logoScale.value },
    ],
  }));

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <View style={styles.blackContainer}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Ionicons name="person-circle-outline" size={80} color="#fff" />
        </Animated.View>

        <Animated.View style={[styles.whiteBox, boxStyle]}>
          <Text style={styles.header}>Login</Text>

          <View style={styles.formContainer}>
            <LoginFormRN onSuccess={handleSuccessfulLogin} />

            <View style={styles.registerWrapper}>
              <Text style={styles.registerText}>
                {"You don't have an Account? "}
              </Text>
              <Link href={"register"}>
                <Text style={styles.registerLink}>Register Here</Text>
              </Link>
            </View>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  blackContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-end",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
  },
  whiteBox: {
    backgroundColor: "#fff",
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 100,
    paddingBottom: 40,
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 36,
    fontWeight: "500",
    marginTop: 60,
    textAlign: "center",
    color: "#000",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
    gap: 8,
  },
  registerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: { color: "#333" },
  registerLink: {
    textDecorationLine: "underline",
    color: "#000",
    textAlign: "center",
  },
});
