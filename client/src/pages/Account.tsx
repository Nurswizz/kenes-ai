import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useMemberstack } from "../context/MemberstackProvider";
import { preconnect } from "react-dom";
import { LoaderCircle } from "lucide-react";

const Account = () => {
  const [user, setUser] = useState<any>(null);
  const memberstack = useMemberstack();
  const [loading, setLoading] = useState<boolean>(false)

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
    setLoading(true);
    await memberstack.logout();
    localStorage.removeItem("user");
    setLoading(false);
    window.location.href = "/";
  };

  if (!user) return <div className="text-center p-10">Loading...</div>;
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full px-48 py-16 max-lg:px-10">
        <h1 className="text-4xl font-bold">Account Details</h1>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold">Full name</h1>
          <h3>
            {user.firstName} {user.lastName}
          </h3>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold">Email</h1>
          <h3>{user.email}</h3>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold">Phone number</h1>
          <h3>{user.phone ? user.phone : "None"}</h3>
        </div>
        <button className="mt-4 bg-navbar py-2 px-4 rounded w-[100px]">
          Edit
        </button>
        <div>
          <button
            onClick={handleLogOut}
            disabled={loading}
            className="mt-4 bg-navbar py-2 px-4 rounded w-[100px] flex justify-center"
          >
            {loading ? (
              <LoaderCircle className="animate-spin h-5 w-5" />
            ) : (
              "Log out"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
