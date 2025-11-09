// import { StyleSheet, Text, View } from "react-native";
// import React from "react";

// const Login = () => {
//   return (
//     <View>
//       <Text>Login</Text>
//     </View>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({});

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import LoginFormRN from "../../components/pages/LoginForm";

// type LoginPageNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "Login"
// >;

const LoginPage = () => {
  // const { t } = useLanguageContext();
  // const navigation = useNavigation<LoginPageNavigationProp>();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <View
        style={{
          backgroundColor: "#000",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            width: "100%",
            height: "40%",
          }}
        >
          <Ionicons name="person-circle-outline" size={80} color="#fff" />
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            backgroundColor: "#fff",
            width: "100%",
            height: "60%",
            borderTopLeftRadius: 100,
            paddingBottom: 40,
          }}
        >
          <Text style={[styles.header, { zIndex: 10, marginTop: 60 }]}>
            <Text style={[styles.subHeader, { color: "#000" }]}>{"Login"}</Text>
          </Text>

          <View style={styles.formContainer}>
            <LoginFormRN />

            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text style={styles.registerText}>
                {"You don't have an Account?"}{" "}
              </Text>

              <Link href={"register"}>
                <Text
                  style={{
                    textDecorationLine: "underline",
                    // color: theme.colors.primary,
                    textAlign: "center",
                  }}
                >
                  {"Register Here"}
                </Text>
              </Link>
            </View>
          </View>
        </View>
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
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    zIndex: 10,
    alignItems: "center",
  },
  subHeader: {
    fontSize: 36,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  registerText: {
    color: "#333",
  },
});
