import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = Cookies.get("isLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;
