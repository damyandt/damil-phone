import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "../ThemedText";

const LoginFormRN = ({
  onSuccess,
  formData,
  setFormData,
}: {
  onSuccess: any;
  formData: any;
  setFormData: any;
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validator = (onlyEmail = false) => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = "This field is required";
    if (!onlyEmail && !formData.password)
      newErrors.password = "This field is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validator(false)) return;

    onSuccess?.();
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
            setFormData((prev: any) => ({ ...prev, email: text }));
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
            setFormData((prev: any) => ({ ...prev, password: text }));
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
      {Object.values(errors).length !== 0 && (
        <ThemedText>{Object.values(errors)[0]}</ThemedText>
      )}
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
