import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuthedContext } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import callApi from "../../API/callApi";
import { postLogin } from "../../API/queries/auth/apiAuthpostQueris";
import { COOKIE_REFRESH_TOKEN } from "../../constants/auth";
import { setCookie } from "../../Global/Utils/commonFunctions";
import { router } from "expo-router";

const LoginFormRN = () => {
  const { setUserSignedIn } = useAuthedContext();
  //   const { t } = useLanguageContext();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const [disableEmail, setDisableEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const validator = (onlyEmail = false) => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = "This field is required";
    if (!onlyEmail && !formData.password)
      newErrors.password = "This field is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleNextClick = async () => {
  //   if (!validator(true)) return;

  //   try {
  //     //   const response = await callApi<any>({
  //     //     query: validateEmail({ email: formData.email }),
  //     //     auth: null,
  //     //   });

  //     //   if (!response.success) {
  //     //     setErrors({ email: errorMessages(t).invalidEmail });
  //     //     return;
  //     //   }
  //     setDisableEmail(true);
  //     setTimeout(() => passwordRef.current?.focus(), 100);
  //   } catch (err) {
  //     //   setErrors({ email: errorMessages(t).internalServerError });
  //     console.log("Email validation failed:", err);
  //   }
  // };

  const handleLogin = async () => {
    if (!validator(false)) return;
    console.log(formData);
    try {
      const response = await callApi<any>({
        query: postLogin(formData),
        auth: null,
      });
      console.log("Login response:", response);

      //   if (!response.success) {
      //     setErrors({ password: "Invalid Password!" });
      //     return;
      //   }

      //   if (response.message === errorMessages(t).unverified) {
      //     setOpenModal(true);
      //     return;
      //   }

      const refreshCookie: any = {
        name: COOKIE_REFRESH_TOKEN,
        value: response.refreshToken,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        sameSite: "strict",
        secure: true,
      };
      await setCookie(refreshCookie);
      setUserSignedIn(true);
      //   passwordRef.current?.focus();
      router.replace("/(tabs)");
    } catch (err) {
      setErrors({ password: "Invalid Password!" });
      console.log("Login failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            { borderColor: errors.email ? "#D94646" : "#ccc" },
          ]}
          placeholder={errors.email || "Email"}
          value={formData.email}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, email: text }));
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            { borderColor: errors.password ? "#D94646" : "#ccc" },
          ]}
          placeholder={errors.password || "Password"}
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, password: text }));
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.iconWrapper}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <Text style={{ alignSelf: "flex-end", color: "#333" }}>
        Forgot Password?
      </Text>
      <TouchableOpacity onPress={handleLogin} style={[styles.submitBtn]}>
        <Text style={styles.submitBtnText}>{"Sign In"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginFormRN;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    width: "100%",
    paddingRight: 40,
  },
  disabledInput: { backgroundColor: "#eee" },
  togglePasswordBtn: { marginVertical: 8, alignSelf: "flex-end" },
  submitBtn: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    marginTop: 36,
    width: "100%",
    alignSelf: "flex-end",
    color: "#fff",
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontWeight: "600" },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    position: "absolute",
    right: 10,
  },
});
