import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { User } from "../API/types/authTypes";

import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "../constants/auth";
import { deleteCookie, setCookie } from "../Global/Utils/commonFunctions";
import { getQueryUsersGetCurrentUser } from "../API/queries/auth/apiAuthGetQueries";
import callApi from "../API/callApi";
import { postLogin } from "../API/queries/auth/apiAuthpostQueris";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isReady: boolean;
  isLoggedIn: boolean;
  authedUser: Partial<User> | null;
  setAuthedUser: React.Dispatch<React.SetStateAction<Partial<User>>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  router: any;
};

export const AuthContext = createContext<AuthState>({
  isReady: false,
  isLoggedIn: false,
  authedUser: { email: "error" },
  setAuthedUser: () => {},
  login: async () => false,
  logout: () => {},
  router: null,
});

const STORAGE_AUTH_KEY = "auth-storage";
export const storeAuthState = async (loggedIn: boolean) => {
  await AsyncStorage.setItem(
    STORAGE_AUTH_KEY,
    JSON.stringify({ isLoggedIn: loggedIn })
  );
};
export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authedUser, setAuthedUser] = useState<Partial<User>>({
    email: "error",
  });

  // ---------------------------------------
  // SAVE AUTH STATE TO STORAGE
  // ---------------------------------------

  // ---------------------------------------
  // FETCH USER DATA USING ACCESS TOKEN
  // ---------------------------------------
  const fetchUserData = async () => {
    const userInfo = await callApi<any>({
      query: getQueryUsersGetCurrentUser(),
      auth: { setAuthedUser },
    });

    if (userInfo.success && userInfo.data) {
      setAuthedUser(userInfo.data);
      return true;
    }

    return false;
  };

  // ---------------------------------------
  // LOGIN FLOW
  // ---------------------------------------
  const login = async (email: string, password: string) => {
    try {
      const response = await callApi<any>({
        query: postLogin({ email, password }),
        auth: null,
      });

      const { refreshToken, accessToken } = response.data;
      if (!refreshToken || !accessToken) {
        logout();
        return false;
      }

      // store cookies
      await setCookie({
        name: COOKIE_REFRESH_TOKEN,
        value: refreshToken,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
        sameSite: "strict",
        secure: true,
      });

      await setCookie({
        name: COOKIE_ACCESS_TOKEN,
        value: accessToken,
        exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 min
        sameSite: "strict",
        secure: true,
      });
      setIsLoggedIn(true);
      await storeAuthState(true);

      // 3. Fetch logged in user info
      await fetchUserData();
      // 4. Navigate to app home
      router.replace("/");

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // ---------------------------------------
  // LOGOUT FLOW
  // ---------------------------------------
  const logout = async () => {
    setIsLoggedIn(false);
    setAuthedUser({ email: "error" });
    await storeAuthState(false);

    // remove cookies
    await deleteCookie(COOKIE_REFRESH_TOKEN);
    await deleteCookie(COOKIE_ACCESS_TOKEN);

    return <Redirect href="/login" />;
  };

  // ---------------------------------------
  // RESTORE AUTH FROM STORAGE ON LAUNCH
  // ---------------------------------------
  useEffect(() => {
    const loadAuthState = async () => {
      setIsLoggedIn(false);

      const saved = await AsyncStorage.getItem(STORAGE_AUTH_KEY);
      const refreshToken = await AsyncStorage.getItem(COOKIE_REFRESH_TOKEN);

      if (saved && refreshToken) {
        const parsed = JSON.parse(saved);

        if (parsed.isLoggedIn) {
          setIsLoggedIn(true);
          await fetchUserData();
        }
      } else {
        logout();
      }

      setIsReady(true);
      SplashScreen.hideAsync();
    };
    // };

    loadAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        authedUser,
        setAuthedUser,
        login,
        logout,
        router,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
