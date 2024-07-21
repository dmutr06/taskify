import { createContext, FC, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const AuthContext = createContext<{ token: string | undefined, setToken: (newToken: string) => void, resetToken: () => void } | null>(null);

const AuthProvider: FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!cookies.auth && !location.pathname.startsWith("/auth")) return navigate("/auth");
    if (cookies.auth && location.pathname.startsWith("/auth")) return navigate("/");
  }, [cookies.auth]);

  return <AuthContext.Provider value={{
    token: cookies.auth,
    setToken: (newToken: string) => setCookie("auth", newToken),
    resetToken: () => removeCookie("auth")
    }}>
    <Outlet />
  </AuthContext.Provider>
};

export default AuthProvider;
