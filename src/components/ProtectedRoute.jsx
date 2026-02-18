import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8e6cf, #7ec8e3, #93c5fd)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ color: "#1e3a8a", fontSize: "1.2rem", fontWeight: "600" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;