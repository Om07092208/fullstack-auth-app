import { useState } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import { loginUser, registerUser } from "./api";

function App() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      setError("");
      const data = await registerUser(formData);
      saveSession(data);
      setMessage("Registration successful.");
      setMode("login");
    } catch (apiError) {
      setMessage("");
      setError(apiError.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      setError("");
      const data = await loginUser(formData);
      saveSession(data);
      setMessage("Login successful.");
    } catch (apiError) {
      setMessage("");
      setError(apiError.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    if (mode === "register") {
      await handleRegister(formData);
      return;
    }

    await handleLogin(formData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMessage("Logged out successfully.");
    setError("");
  };

  return (
    <main className="layout">
      <section className="hero">
        <p className="badge">React + Express + MongoDB Atlas</p>
        <h1>Full Stack Authentication Portal</h1>
        <p className="copy">
          Register a new account, log in, and keep your JWT token stored locally for
          authenticated sessions.
        </p>

        <div className="toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {message && <p className="status success">{message}</p>}
        {error && <p className="status error">{error}</p>}
      </section>

      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthForm mode={mode} onSubmit={handleSubmit} loading={loading} />
      )}
    </main>
  );
}

export default App;
