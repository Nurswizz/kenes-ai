import logo from "../assets/logo.png";
import {
  Home,
  File,
  Search,
  MessageCircle,
  UserCircle,
  Bot,
} from "lucide-react";
import { useNavigate } from "react-router";

const navItems = [
  { label: "Dashboard", icon: <Home />, path: "/dashboard" },
  { label: "Letter", icon: <File />, path: "/tools/letter-builder" },
  { label: "Style", icon: <Search />, path: "/tools/style-checker" },
  { label: "Advisor", icon: <MessageCircle />, path: "/tools/advisor-chat" },
  { label: "Sim Chat", icon: <Bot />, path: "/tools/simulator-chat" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="ml-12 h-full w-64 relative top-0 left-0 flex-col justify-between max-lg:hidden flex">
        <div className="flex flex-col">
          <button
            onClick={() => handleRedirect("/")}
            className="flex items-center justify-center"
          >
            <img src={logo} alt="Logo" className="w-64 h-auto" />
          </button>
          <div className="flex flex-col gap-5">
            {navItems.map(({ label, icon, path }) => (
              <button
                key={path}
                onClick={() => handleRedirect(path)}
                className="flex gap-x-3 mx-4 p-1 transition-colors hover:bg-[#cdcdcd] rounded-md"
              >
                {icon}
                <p className="font-semibold">{label}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <button
            onClick={() => handleRedirect("/account")}
            className="flex gap-x-3 mx-4 p-1 transition-colors hover:bg-[#cdcdcd] rounded-md mb-12"
          >
            <UserCircle />
            <p className="font-semibold">Account</p>
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden bg-[white] fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-50 flex justify-around py-2">
        {[...navItems, { label: "Account", icon: <UserCircle />, path: "/account" }].map(
          ({ label, icon, path }) => (
            <button
              key={label}
              onClick={() => handleRedirect(path)}
              className="flex flex-col items-center text-sm text-gray-800 hover:text-black"
            >
              {icon}
              <span className="text-xs">{label}</span>
            </button>
          )
        )}
      </div>
    </>
  );
};

export default Sidebar;
