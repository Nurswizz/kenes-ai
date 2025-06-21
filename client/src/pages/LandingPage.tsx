import { useState } from "react";
import logo from "../assets/logo.png";
import man from "../assets/landing_page_man.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-navbar shadow-md w-full fixed top-0 left-0 z-50 flex items-center justify-between px-6 xl:px-40">
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
        className={`absolute xl:static top-16 left-0 w-full xl:w-auto bg-navbar xl:bg-transparent transition-all duration-200 z-40 ${
          menuOpen ? "block" : "hidden"
        } xl:block`}
      >
        <ul className="flex flex-col xl:flex-row xl:space-x-6 text-2xl items-center">
          <li>
            <a
              href="/"
              className="px-4 py-2 transition rounded-xl hover:bg-[#6d7487] block"
            >
              Инструменты
            </a>
          </li>
          <li>
            <a
              href="/"
              className="px-4 py-2 transition rounded-xl hover:bg-[#6d7487] block"
            >
              Как это работает
            </a>
          </li>
          <li>
            <a
              href="/"
              className="px-4 py-2 transition rounded-xl hover:bg-[#6d7487] block"
            >
              Блог
            </a>
          </li>
          <li>
            <a
              href="/"
              className="px-4 py-2 transition rounded-xl hover:bg-[#6d7487] block"
            >
              Помощь
            </a>
          </li>
          <li>
            <button className="bg-primary rounded-xl py-4 px-6 text-[#ffffff] transition hover:bg-[#6d7487] w-full xl:w-auto">
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

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-between w-full px-6 xl:px-40">
        <div className="flex flex-col justify-center mt-20 text-left gap-y-8">
          <h1 className="max-sm:text-3xl text-primary text-7xl font-bold">
            Говорим с властью
          </h1>
          <h3 className="max-sm:text-sm text-xl text-primary text-left max-w-[700px]">
            Создавайте официальные письма, обращения и запросы на казахском или
            русском — за считанные минуты. <br></br>
            Kenes AI помогает правильно сформулировать идею, соблюсти стиль и
            ссылаться на нужные законы.
          </h3>
          <div className="flex gap-x-5">
            <button
              type="button"
              className="bg-primary p-4 px-8 rounded-3xl text-[#ffffff] font-medium text-lg transition hover:bg-[#6d7487]"
            >
              Начать работу
            </button>
            <button
              type="button"
              className="text-primary p-4 px-8 rounded-3xl font-medium text-lg border-2 transition-all hover:border-primary"
              style={{
                boxShadow: "0 0 0 2px transparent",
                border: "2px solid",
                borderColor: "currentColor",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 2px currentColor")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 2px transparent")
              }
            >
              Посмотреть функцию
            </button>
          </div>
        </div>

        <div className="ml-10 rounded-lg shadow-lg overflow-hidden hidden xl:block">
          <img src={man} alt="man" width={300} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
