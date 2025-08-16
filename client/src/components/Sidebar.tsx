import logo from "../assets/logo.png";
import {
  Home,
  File,
  Search,
  MessageCircle,
  UserCircle,
  Bot,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router";
import { StarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";




const Sidebar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const navItems = [
  { label: t("dashboard"), icon: <Home />, path: "/dashboard" },
  { label: t("letter"), icon: <File />, path: "/tools/letter-builder" },
  { label: t("style"), icon: <Search />, path: "/tools/style-checker" },
  { label: t("advisor"), icon: <MessageCircle />, path: "/tools/advisor" },
  { label: t("simulator"), icon: <Bot />, path: "/tools/simulator" },

];
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLanguageChange = () => {
    const newLang = currentLanguage === "en" ? "ru" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    setCurrentLanguage(newLang);
  };

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
        <div className="flex flex-col mb-12 gap-4">
          <button
            onClick={() => handleRedirect("/account")}
            className="flex gap-x-3 p-1 transition-colors hover:bg-[#cdcdcd] rounded-md"
          >
            <UserCircle />
            <p className="font-semibold">{t("account")}</p>
          </button>
          <button
            onClick={() => handleRedirect("/plans")}
            className="flex gap-x-3 p-1 transition-colors hover:bg-[#cdcdcd] rounded-md"
          >
            <StarIcon />
            <p className="font-semibold">{t("plans")}</p>
          </button>

          <button
            className="flex gap-x-3 p-1 transition-colors hover:bg-[#cdcdcd] rounded-md"
            onClick={handleLanguageChange}
          >
            <Globe />
            <p className="font-semibold">{t("language")}</p>
          </button>

        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-50 flex justify-around py-2">
        {[
          ...navItems,
          { label: t("account"), icon: <UserCircle />, path: "/account" },
        ].map(({ label, icon, path }) => (
          <button
            key={label}
            onClick={() => handleRedirect(path)}
            className="flex flex-col items-center text-sm text-gray-800 hover:text-black"
          >
            {icon}
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
