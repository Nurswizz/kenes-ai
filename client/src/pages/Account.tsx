import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { preconnect } from "react-dom";
import { LoaderCircle } from "lucide-react";
import useApi from "../hooks/useApi";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";

const Account = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {fetchData} = useApi();
  const { t } = useTranslation();
  const { logout } = useAuth();
  
  useEffect(() => {
    
    const fetchUser = async () => {

      try {
        const response = await fetchData(`/users/me`);
        setUser(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("An error occurred while fetching user data. Please try again later.");
      }
    }
    fetchUser();
  }, [])

  
  useEffect(() => {
    preconnect(import.meta.env.VITE_API_URL);
    
  }, []);
  const handleLogOut = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpgrade = async () => {
    const planId = import.meta.env.VITE_PLAN_PRO_ID;
    if (!planId) {
      console.error("Plan ID is not defined in environment variables.");
      return;
    }
    try {
      // checkout and upgrading through memberstack

      await fetchData("/users/plan", {
        method: "PUT",
        body: JSON.stringify({ plan: "Pro" }),
      });
    } catch (error) {
      console.error("Error upgrading plan:", error);
      alert("An error occurred while upgrading. Please try again later.");
    }
  }



  if (!user) return <div className="text-center p-10">Loading...</div>;
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full px-48 py-16 max-lg:px-10">
        <h1 className="text-4xl font-bold">{t("account-details")}</h1>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold">{t("full-name")}</h1>
          <h3>
            {
              user.firstName + user.lastName
                ? `${user.firstName} ${user.lastName}`
                : t("none")
            }
          </h3>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold">Email</h1>
          <h3>{user.email}</h3>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold">Plan</h1>
          <h3>{user.plan ? user.plan : "Free"}</h3>
        </div>
        <button onClick={handleUpgrade} className="mt-4 bg-navbar py-2 px-4 rounded w-[150px]">
          Upgrade to Pro
        </button>
        <button className="mt-4 bg-navbar py-2 px-4 rounded w-[150px] flex justify-center">
          {t("edit")}
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
              t("logout")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
