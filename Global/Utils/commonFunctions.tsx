import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetCookieParams } from "../../API/types/authTypes";

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

  try {
    await AsyncStorage.setItem(name, cookieData);
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

    if (!cookieData.value || !isTokenValid(cookieData.value)) {
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
