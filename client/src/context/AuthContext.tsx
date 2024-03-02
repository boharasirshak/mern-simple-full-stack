import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AuthContextType,
  AuthResponse,
  Login,
  Signup,
} from "../types/AuthContext";

import { httpClient } from "@config/axiosConfig";
import { isAxiosError } from "axios";
import { UserDataType } from "../types/User";

import { setAccesstoken } from "@src/helper/Token";
import useAuthHttpClient from "@src/hooks/useAuthHttpClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Partial<UserDataType> | undefined>(
    undefined
  );
  const authHttpClient = useAuthHttpClient();

  const getUserdetail = () => {
    authHttpClient
      .get("/user")
      .then((res) => setUser(res.data))
      .catch((e) => e);
  };

  useEffect(() => {
    getUserdetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const login: Login = async ({ email, password }) => {
    let err = "";
    try {
      const { data } = await httpClient.post<AuthResponse>(
        "/auth/signin",
        { email, password },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log(data);
      setUser(data.user);
      setAccesstoken(data.accessToken as string);
    } catch (error) {
      if (isAxiosError(error)) {
        err = error.response?.data.error.message;
      } else {
        err = "Opps! Something Unexpected happens";
      }
    }

    return err;
  };

  const signup: Signup = async (signUpData) => {
    let err = "";
    try {
      const { data } = await httpClient.post<AuthResponse>("/auth/signup", signUpData);
      console.log(data);
      setUser(data.user);
      setAccesstoken(data.accessToken as string);

    } catch (error) {
      if (isAxiosError(error)) {
        err = error.response?.data.error.message;
      } else {
        err = "Opps! Something Unexpected happens";
      }
    }
    return err;
  };

  const signout = async () => {
    let err = "";
    try {
      await httpClient.get<AuthResponse>("/auth/signout");
      setUser(undefined);
      setAccesstoken("");
      navigate("/");
    } catch (error) {
      if (isAxiosError(error)) {
        err = error.response?.data.error.message;
      } else {
        err = "Opps! Something Unexpected happens";
      }
    }
    return err;
  };

  const value = {
    user,
    login,
    signup,
    signout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
