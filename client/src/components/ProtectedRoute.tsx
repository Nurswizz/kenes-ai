import { useEffect, useState } from "react";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setUser] = useState();
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!localUser || Object.keys(localUser).length === 0) {
      window.location.href = "/";
    } else {
      setUser(localUser);
    }

  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
