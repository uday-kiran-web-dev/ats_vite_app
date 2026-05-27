import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  // Restore user synchronously on initial render
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error("Failed to parse user info from local storage:", error);
        localStorage.removeItem("userInfo");
      }
    }
    return null;
  });

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
