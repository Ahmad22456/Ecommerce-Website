import axios from "axios";
import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Default Axios
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth, AuthProvider };
