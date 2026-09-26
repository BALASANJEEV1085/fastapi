import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [isLoginView, setIsLoginView] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");


  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          full_name: fullName,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      setSuccessMsg("Account created successfully! Please log in.");
      setIsLoginView(true);
      setPassword("");
      
    } catch (err) {
      setError(err.message);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      
      localStorage.setItem("access_token", data.access_token);
      setToken(data.access_token);
      
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setProfile(null);
  };

  return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh",fontFamily: "sans-serif" }}>
      <h1>FastAPI + React Auth App</h1>

      {token ? (
        <div>
          <h2>Welcome! You are logged in.</h2>
          <button onClick={fetchProfile}>Get My Profile Data</button>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Log Out</button>

          {profile && (
            <div style={{ marginTop: "20px", padding: "10px", background: "#f0f0f0" }}>
              <p><strong>Name:</strong> {profile.full_name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Username:</strong> {profile.username}</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ width: "300px" }}>
          <form 
            onSubmit={isLoginView ? handleLogin : handleRegister} 
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <h2 style={{ textAlign: "center", margin: "0" }}>
              {isLoginView ? "Login" : "Sign Up"}
            </h2>
            
            {error && <p style={{ color: "#ff6b6b", margin: "0", textAlign: "center" }}>{error}</p>}
            {successMsg && <p style={{ color: "#51cf66", margin: "0", textAlign: "center" }}>{successMsg}</p>}

            {!isLoginView && (
              <>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label>Full Name:</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label>Email:</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </>
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Username:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" style={{ padding: "10px", cursor: "pointer", marginTop: "10px" }}>
              {isLoginView ? "Log In" : "Register Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px" }}>
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError("");
                setSuccessMsg("");
              }} 
              style={{ color: "#646cff", cursor: "pointer", textDecoration: "underline" }}
            >
              {isLoginView ? "Sign up here" : "Log in here"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;