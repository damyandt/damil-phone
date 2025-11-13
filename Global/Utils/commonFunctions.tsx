import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetCookieParams } from "../../API/types/authTypes";
import { COOKIE_ACCESS_TOKEN } from "../../constants/auth";

/**
 * Sets a "cookie" in AsyncStorage (simulating browser cookies)
 */
export const setCookie = async (cookie: SetCookieParams) => {
  const { name, value, exp } = cookie;
  const expiryTime = exp ? exp * 1000 : null; // convert to ms

  const cookieData = JSON.stringify({
    value,
    expires: expiryTime,
  });
  // console.log("15", cookieData);
  try {
    await AsyncStorage.setItem(name, cookieData);
    // console.log("18", await AsyncStorage.getItem(name));
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
};

const isTokenValid = (token: string): boolean => {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  return parts.length === 3;
};

export const getCookie = async (name: string): Promise<string | null> => {
  try {
    const cookieStr = await AsyncStorage.getItem(name);
    if (!cookieStr) return null;

    const cookieData = JSON.parse(cookieStr);

    if (
      !cookieData.value ||
      (name === COOKIE_ACCESS_TOKEN && !isTokenValid(cookieData.value))
    ) {
      await deleteCookie(name);
      return null;
    }

    if (cookieData.expires && Date.now() > cookieData.expires) {
      await deleteCookie(name);
      return null;
    }
    return cookieData.value;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
};

export const deleteCookie = async (name: string) => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (error) {
    console.error("Error deleting cookie:", error);
  }
};

/**
 * Checks if a value is a plain object
 */
export const isObject = (value: any): value is Record<string, any> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * Checks if a value is an array
 */
export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

export const debugStorage = async () => {
  try {
    const refresh = await getCookie("refreshToken");
    // const refresh: any = await AsyncStorage.getItem("refreshTokenr");
    // const token: any = await AsyncStorage.getItem("refreshToken");
    console.log("Raw:", refresh);
    // console.log("Type:", typeof token);
    // console.log(
    //   "Chars:",
    //   Array.from(token).map((c: any) => c.charCodeAt(0))
    // );

    // // Try safe parse
    // try {
    //   const parsed = JSON.parse(token);
    //   console.log("✅ Parsed:", parsed);
    // } catch (err:any) {
    //   console.error("❌ Parse failed:", err.message);
    // }
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    console.log("🔍 AsyncStorage contents:");
    result.forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
  } catch (error) {
    console.error("Error reading AsyncStorage:", error);
  }
};
