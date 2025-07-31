import { useState } from "react";
import logo from "../assets/logo.png";
import clsx from "clsx";

const handleStart = (
) => {
  window.location.href = "/auth/signup";
};
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-navbar shadow-md w-full absolute top-0 left-0 z-50 flex items-center justify-between px-6 xl:px-40">
      <button onClick={() => (window.location.href = "/")}>
        <img src={logo} alt="logo" width={160} className="xl:w-[200px]" />
      </button>

      <div className="xl:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="focus:outline-none"
          aria-label="Open menu"
        >
          <svg
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 8h24M4 16h24M4 24h24" />
          </svg>
        </button>
      </div>

      <div
        className={clsx(
          "absolute xl:static top-16 left-0 w-full xl:w-auto bg-navbar xl:bg-transparent transition-all duration-200 z-40",
          menuOpen ? "block" : "hidden",
          "xl:block"
        )}
      >
        <ul className="flex flex-col xl:flex-row xl:space-x-6 text-2xl items-center">
          {["Инструменты", "Как это работает", "Блог", "Помощь"].map(
            (label, i) => (
              <li key={i}>
                <a
                  href="/"
                  className="px-4 py-2 transition rounded-xl hover:bg-[#6d7487] block"
                >
                  {label}
                </a>
              </li>
            )
          )}
          <li>
            <button
              onClick={() => {
                handleStart();
              }}
              className="bg-primary rounded-xl py-4 px-6 text-white transition hover:bg-[#6d7487] w-full xl:w-auto"
            >
              Начать
            </button>
          </li>
        </ul>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 xl:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export { Navbar, handleStart };
