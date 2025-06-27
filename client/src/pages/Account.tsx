import Sidebar from "../components/Sidebar";
import memberstack from "@memberstack/dom";

const Account = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user == "{}") {
    window.location.href = "/";
    return;
  }

  const handleLogOut = async () => {
    const memberstackInstance = await memberstack.init({
      publicKey: import.meta.env.VITE_MEMBERSTACK_PUBLIC_KEY,
      useCookies: true,
    });

    memberstackInstance.logout();
    window.location.href = "/"
  };
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
