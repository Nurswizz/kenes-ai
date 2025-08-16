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
  const { fetchData } = useApi();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newData, setNewData] = useState<any>({
    fullName: user?.firstName + " " + user?.lastName || "",
    email: user?.email || "",
  });
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (user) {
      setNewData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
      });
    }
  }, [user]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = (await fetchData(`/users/me`)) as any;
        setUser(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert(
          "An error occurred while fetching user data. Please try again later."
        );
      }
    };
    fetchUser();
  }, [localStorage.getItem("user")]);

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

  const handleEdit = async () => {
    if (isEditing) {
      if (!newData.firstName || !newData.lastName || !newData.email) {
        setError("Please fill in all fields.");
        return;
      }
      if (
        newData.firstName === user.firstName &&
        newData.lastName === user.lastName &&
        newData.email === user.email
      ) {
        setError("No changes made.");
        setIsEditing(false);
        return;
      }
      if (!/\S+@\S+\.\S+/.test(newData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      const updatedData = {
        firstName: newData.firstName,
        lastName: newData.lastName,
        email: newData.email,
      };
      try {
        await fetchData(`/users/me`, {
          method: "PUT",
          body: JSON.stringify(updatedData),
        });
        setUser((prev: any) => ({
          ...prev,
          ...updatedData,
        }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, ...updatedData })
        );
        setError(null);
        alert("User details updated successfully.");
      } catch (error: any) {
        console.error("Error updating user details:", error);
        if (error.status === 400) {
          setError("Email already exists. Please use a different email.");
        }
        setError(
          "An error occurred while updating user details. Please try again later."
        );
      }
    }

    setIsEditing((prev) => !prev);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
    });
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoaderCircle className="animate-spin w-8 h-8 text-primary" />
        </div>
      </div>
    );
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full px-48 py-16 max-lg:px-10">
        <h1 className="text-4xl font-bold">{t("account-details")}</h1>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold">{t("full-name")}</h1>
          <h3>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={newData.firstName}
                  onChange={(e) =>
                    setNewData({ ...newData, firstName: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  value={newData.lastName}
                  onChange={(e) =>
                    setNewData({ ...newData, lastName: e.target.value })
                  }
                  className="border p-2 rounded w-full mt-2"
                />
              </div>
            ) : user.firstName + user.lastName ? (
              `${user.firstName} ${user.lastName}`
            ) : (
              t("none")
            )}
          </h3>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold">Email</h1>
          {isEditing ? (
            <input
              type="email"
              value={newData.email}
              onChange={(e) =>
                setNewData({ ...newData, email: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
          ) : (
            <h3>{user.email}</h3>
          )}
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold">Plan</h1>
          <h3>{user.plan ? user.plan : "Free"}</h3>
        </div>
        {error && <div className="text-[red] mt-2">{error}</div>}

        <button
          onClick={handleEdit}
          className="mt-4 bg-navbar py-2 px-4 rounded w-[150px] flex justify-center"
        >
          {isEditing ? t("save") : t("edit")}
        </button>
        {isEditing && (
          <button
            onClick={handleCancel}
            className="mt-4 bg-navbar py-2 px-4 rounded w-[150px] flex justify-center"
          >
            {t("cancel")}
          </button>
        )}
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
