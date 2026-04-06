import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDefaultRoute } from "@/lib/auth";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams((window.location.hash || "").replace(/^#/, ""));

    const token = hashParams.get("token") || queryParams.get("token");
    const name = hashParams.get("name") || queryParams.get("name");
    const email = hashParams.get("email") || queryParams.get("email");
    const role = hashParams.get("role") || queryParams.get("role") || "employee";
    const refreshToken = hashParams.get("refresh_token") || queryParams.get("refresh_token");

    if (token) {
      // LocalStorage mein save karo
      localStorage.setItem("token", token);
      localStorage.setItem("name", name || "");
      localStorage.setItem("email", email || "");
      localStorage.setItem("role", role);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      // Dashboard pe redirect karo
      navigate(getDefaultRoute(role), { replace: true });
    } else {
      // Token nahi mila — login pe wapas bhejo
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontFamily: "sans-serif",
      gap: "16px"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #6366f1",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "#64748b", fontSize: "16px" }}>
        Logging you in...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OAuthSuccess;
