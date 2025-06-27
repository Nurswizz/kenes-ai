import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useMemberstack } from "../context/MemberstackProvider";
import { preconnect } from "react-dom";

const Account = () => {
  const [user, setUser] = useState<any>(null);
  const memberstack = useMemberstack();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!localUser || Object.keys(localUser).length === 0) {
      window.location.href = "/";
    } else {
      setUser(localUser);
    }
  }, []);
  useEffect(() => {
    preconnect(import.meta.env.VITE_API_URL);
  }, []);
  const handleLogOut = async () => {
    await memberstack.logout();
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) return <div className="text-center p-10">Loading...</div>;
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center py-24 text-primary">
        <div className="flex flex-col bg-navbar w-[50%] h-[50%] items-center pt-10 rounded-2xl">
          <h1 className="font-bold text-4xl">Account Details</h1>
          <div className="flex flex-col text-2xl mt-10 items-center">
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Plan: {user.plan}</p>
            <button
              className="bg-[#ce3333] text-white px-4 py-2 mt-4 rounded max-w-32"
              type="button"
              onClick={handleLogOut}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
