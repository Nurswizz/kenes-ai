import { useEffect, useState } from "react";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setUser] = useState();
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("accessToken");
    if (!localUser || Object.keys(localUser).length === 0 || !token) {
      window.location.href = "/";
      console.error("No user found in localStorage, redirecting to home.", localUser, Object.keys(localUser).length);
    } else {
      setUser(localUser);
    }

  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
