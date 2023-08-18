import React, { createContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext([]);

export const AuthProvider = ({ children }) => {
  const props = useState({});

  const authenticate = async () => {
    if (localStorage.getItem("accesstoken")) {
      try {
        const { data: user } = await api.get("api/user/register_user/");
        if (user.email) {
          props[1](user);
        }
      } catch (error) {
        if (error.response?.status === 401 && error.response?.data.code === "token_not_valid") {
          localStorage.removeItem("accesstoken");
        }
      }
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
};

export default AuthContext;
