import { createContext, JSX, useContext, useEffect, useState } from "react";
import { getCookie } from "../Global/Utils/commonFunctions";
import callApi from "../API/callApi";
import {
  getFromAsyncStorage,
  handleFetchUserAccessToken,
  handleUserSignOut,
} from "./authContextUtils";
import { User } from "../API/types/authTypes";
import {
  PaletteMode,
  PreferencesType,
  Response,
} from "../API/types/commonTypes";
import {
  getPreferences,
  getQueryUsersGetCurrentUser,
  getQueryUserTenant,
} from "../API/queries/auth/apiAuthGetQueries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COOKIE_REFRESH_TOKEN } from "../constants/auth";

export type GetQueryUsersGetCurrentUserSnippet = { user: User };

interface UserContextType {
  authedUser: Partial<User>;
  setAuthedUser: (value: React.SetStateAction<Partial<User>>) => void;
  setUserSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshUserData: React.Dispatch<React.SetStateAction<boolean>>;
  authedUserLoading: boolean;
  tenantLoading: boolean;
  showIncompleteModal: boolean;
  snoozeModal: (minutes?: number) => void;
  preferences: PreferencesType;
  tenant: any;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

interface AuthContextProps {
  children: JSX.Element | JSX.Element[];
}

const AuthContext = ({ children }: AuthContextProps): React.ReactElement => {
  const [authedUser, setAuthedUser] = useState<Partial<User>>({
    email: "error",
  });
  const [tenant, setTenant] = useState<any>({});
  const [userSignedIn, setUserSignedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTenant, setLoadingTenant] = useState<boolean>(false);
  const [refreshUserData, setRefreshUserData] = useState<boolean>(false);
  const [showIncompleteModal, setShowIncompleteModal] =
    useState<boolean>(false);
  // const storedMode: any = getFromAsyncStorage("themeMode");
  // const defaultMode: PaletteMode =
  //   storedMode === "dark" || storedMode === "light" ? storedMode : "light";

  const [preferences, setPreferences] = useState<PreferencesType>({
    themeColor: "#a250fa",
    mode: "dark",
    currency: "BGN",
    language: "bg",
    homeFilters: [
      "gender - MALE",
      "employment - REGULAR",
      "employment - STUDENT",
      "gender - MALE",
    ],
  });

  const fetchUserData = async () => {
    const userInfo = await callApi<Response<any>>({
      query: getQueryUsersGetCurrentUser(),
      auth: { setAuthedUser },
    });

    userInfo.success && userInfo.data && setAuthedUser(userInfo.data);
  };

  useEffect(() => {
    refreshUserData && fetchUserData();
    setRefreshUserData(false);
  }, [refreshUserData]);

  const fetchPreferences = async () => {
    if (!authedUser.roles?.includes("Member")) {
      const preferencesInfo = await callApi<Response<any>>({
        query: getPreferences(),
        auth: { setAuthedUser },
      });
      preferencesInfo.success &&
        preferencesInfo.data.settings &&
        setPreferences(preferencesInfo.data.settings);
    }
  };

  const fetchTenant = async () => {
    try {
      setLoadingTenant(true);
      const tenantInfo = await callApi<any>({
        query: getQueryUserTenant(),
        auth: { setAuthedUser },
      });
      tenantInfo.success === true && setTenant(tenantInfo.data);
      setLoadingTenant(false);
    } catch (err) {
      console.error("Tenant fetch error", err);
    }
  };

  useEffect(() => {
    if (userSignedIn) {
      fetchPreferences();
      if (
        authedUser.roles?.includes("Admin") ||
        authedUser.roles?.includes("Staff")
      ) {
        fetchTenant();
      }
    }
  }, [userSignedIn]);

  useEffect(() => {
    (async () => {
      try {
        if (!authedUser?.id) {
          setLoading(true);
          await checkIfUserIsSignedIn();
        }
      } catch (err) {
        console.error("Authed user error", err);
      }
      setLoading(false);
    })();
  }, [userSignedIn]);

  useEffect(() => {
    if (authedUser.email === "error" && userSignedIn) {
      setUserSignedIn(false);
    } else if (authedUser.email !== "error" && !userSignedIn) {
      setUserSignedIn(true);
    }
  }, [authedUser?.id]);

  useEffect(() => {
    (async () => {
      try {
        if (!authedUser?.id) {
          setLoading(true);
          await checkIfUserIsSignedIn();
        }
      } catch (err) {
        console.error("Authed user error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (authedUser) {
      let hasEmptyFields =
        Object.values(authedUser).some(
          (val: any) => val === "" || val === null
        ) ||
        Object.values(preferences).some(
          (val: any) => val === "" || val === null
        );
      const snoozeUntil: any = getFromAsyncStorage("incompleteProfileSnooze");
      const now = Date.now();

      if (hasEmptyFields && (!snoozeUntil || now > parseInt(snoozeUntil))) {
        setShowIncompleteModal(true);
      }
    }
  }, [authedUser, preferences]);

  const checkIfUserIsSignedIn = async () => {
    const refreshToken: any = await getCookie(COOKIE_REFRESH_TOKEN);
    console.log("refresh", refreshToken);
    if (refreshToken) {
      const newAccessToken = await handleFetchUserAccessToken(
        refreshToken,
        callApi
      );

      if (newAccessToken) {
        const signedInUser = await callApi<any>({
          query: getQueryUsersGetCurrentUser(),
          auth: { setAuthedUser },
        });

        if (signedInUser.success === true && signedInUser.data) {
          setAuthedUser(signedInUser.data);
        } else {
          handleUserSignOut();
        }
      } else {
        handleUserSignOut();
      }
    }
  };

  const snoozeModal = (minutes = 30) => {
    const snoozeUntil = Date.now() + minutes * 60 * 1000;
    AsyncStorage.setItem("incompleteProfileSnooze", snoozeUntil.toString());
    setShowIncompleteModal(false);
  };
  return (
    <UserContext.Provider
      value={{
        authedUser,
        setAuthedUser,
        setUserSignedIn,
        authedUserLoading: loading,
        tenantLoading: loadingTenant,
        showIncompleteModal,
        snoozeModal,
        preferences,
        setRefreshUserData,
        tenant,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default AuthContext;

export const useAuthedContext = (): UserContextType => useContext(UserContext);
