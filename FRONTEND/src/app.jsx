import { useMemo, useState } from "react";
import Feed from "./components/feed.jsx";
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import Profile from "./components/profile.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [view, setView] = useState(user ? "feed" : "login");

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  const handleLogin = ({ token: newToken, usuario }) => {
    localStorage.setItem("user", JSON.stringify(usuario));
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken("");
    }
    setUser(usuario);
    setView("feed");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setView("login");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <h1 className="brand">FIUSAC Rate</h1>
        {isAuthenticated ? (
          <div className="actions-row">
            <button onClick={() => setView("feed")}>Inicio</button>
            <button onClick={() => setView("profile")}>Perfil</button>
            <button onClick={handleLogout}>Salir</button>
          </div>
        ) : (
          <div className="actions-row">
            <button onClick={() => setView("login")}>Login</button>
            <button onClick={() => setView("register")}>Registro</button>
          </div>
        )}
      </header>

      {!isAuthenticated && view === "login" && (
        <Login onLogin={handleLogin} onGoRegister={() => setView("register")} />
      )}

      {!isAuthenticated && view === "register" && (
        <Register onGoLogin={() => setView("login")} />
      )}

      {isAuthenticated && view === "feed" && (
        <Feed user={user} />
      )}

      {isAuthenticated && view === "profile" && (
        <Profile user={user} />
      )}
    </main>
  );
}

export default App;