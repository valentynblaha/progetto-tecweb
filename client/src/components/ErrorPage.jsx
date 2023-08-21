import React from "react";
import { Navigate, useRouteError } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ErrorPage() {
  const error = useRouteError();
  const [auth, setAuth] = useAuth();

  if (error.response?.status === 401 && error.response?.data.code === "token_not_valid") {
    setAuth({});
    localStorage.removeItem("accesstoken");
  }

  return error.response?.status && auth.email === 401 ? (
    <Navigate to="login/" replace />
  ) : (
    <div className="d-flex align-items-center justify-content-center w-100 flex-column" style={{ height: "100vh" }}>
      <div>
        <span style={{ fontSize: "5rem" }}>{error.status || error.response?.status}</span>
      </div>
      <div style={{ color: "#b0b0b0" }}>{error.response?.statusText || error.code || error.statusText}</div>
      <div>Si è verificato un errore!</div>
    </div>
  );
}
