import React, { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Authentication hook
 * @returns {[auth: {}, setAuth: React.Dispatch<React.SetStateAction<{}>>]} auth hook
 */
const useAuth = () => {
    const [auth] = useContext(AuthContext);
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;
