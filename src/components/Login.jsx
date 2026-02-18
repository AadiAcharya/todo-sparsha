import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useState } from "react";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleGoogleLogin() {
    try {
      setError("");
      await signInWithPopup(auth, googleProvider);
      navigate("/memo");
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "1rem",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "3rem 2.5rem",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }}>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📓</div>
          <h1 style={{
            color: "#fff",
            fontSize: "1.8rem",
            fontWeight: "bold",
            margin: "0 0 0.4rem 0",
            letterSpacing: "-0.5px",
          }}>Dev Memo</h1>
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.85rem",
            margin: 0,
          }}>Your personal developer journal</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 80, 80, 0.15)",
            border: "1px solid rgba(255,80,80,0.3)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            color: "#ff8080",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            background: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "1rem",
            color: "#333",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            transition: "opacity 0.2s, transform 0.1s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => e.target.style.opacity = "0.9"}
          onMouseLeave={(e) => e.target.style.opacity = "1"}
          onMouseDown={(e) => e.target.style.transform = "scale(0.98)"}
          onMouseUp={(e) => e.target.style.transform = "scale(1)"}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.25)",
          fontSize: "0.75rem",
          marginTop: "1.5rem",
          marginBottom: 0,
        }}>
          Secure authentication powered by Firebase
        </p>

      </div>
    </div>
  );
};

export default Login;