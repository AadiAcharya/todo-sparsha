import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function pageChange() {
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    navigate("/memo");
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

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
          }}>📓</div>
          <h1 style={{
            color: "#fff",
            fontSize: "1.8rem",
            fontWeight: "bold",
            margin: "0 0 0.4rem 0",
            letterSpacing: "-0.5px",
          }}>Code Memo</h1>
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.85rem",
            margin: 0,
          }}>Your personal developer journal</p>
        </div>

        {/* Error message */}
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

        {/* Fields */}
        {[
          { label: "Full Name", type: "text", value: name, setter: setName, placeholder: "John Doe" },
          { label: "Email", type: "text", value: email, setter: setEmail, placeholder: "john@example.com" },
          { label: "Password", type: "password", value: password, setter: setPassword, placeholder: "Min. 6 characters" },
          { label: "Confirm Password", type: "password", value: confirmPassword, setter: setConfirmPassword, placeholder: "Repeat your password" },
        ].map((field) => (
          <div key={field.label} style={{ marginBottom: "1.2rem" }}>
            <label style={{
              display: "block",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.75rem",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}>
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && pageChange()}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                padding: "0.85rem 1rem",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
                transition: "border 0.2s",
                fontFamily: "inherit",
              }}
              onFocus={(e) => e.target.style.border = "1px solid rgba(139,92,246,0.6)"}
              onBlur={(e) => e.target.style.border = "1px solid rgba(255,255,255,0.12)"}
            />
          </div>
        ))}

        {/* Button */}
        <button
          onClick={pageChange}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
            border: "none",
            borderRadius: "12px",
            padding: "1rem",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "0.5rem",
            letterSpacing: "0.5px",
            transition: "opacity 0.2s, transform 0.1s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => e.target.style.opacity = "0.9"}
          onMouseLeave={(e) => e.target.style.opacity = "1"}
          onMouseDown={(e) => e.target.style.transform = "scale(0.98)"}
          onMouseUp={(e) => e.target.style.transform = "scale(1)"}
        >
          Enter Journal →
        </button>

        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.25)",
          fontSize: "0.75rem",
          marginTop: "1.5rem",
          marginBottom: 0,
        }}>
          Firebase auth coming soon
        </p>

      </div>
    </div>
  );
};

export default Login;