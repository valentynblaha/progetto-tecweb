
import React, { createContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext([]);

export const AuthProvider = ({ children }) => {
    const props = useState({});

    const authenticate = async() => {
      const { data: user } = await api.get("api/user/register_user/");
      if (user.email) {
        props[1](user)
      }
    }

    useEffect(() => {
      authenticate()
    }, [])

    return (
        <AuthContext.Provider value={props}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
