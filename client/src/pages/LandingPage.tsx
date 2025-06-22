import React, { useState } from "react";
import clsx from "clsx";
import logo from "../assets/logo.png";
import man from "../assets/landing_page_man.png";
import { MessageCircle, User2, CheckCircle, StarsIcon } from "lucide-react";

// ----------------- Card Component ------------------
type CardProps = {
  icon: React.ReactNode;
  header: string;
  description: string;
  className?: string;
};

const Card = ({ icon, header, description, className }: CardProps) => (
  <div className={clsx("bg-[#ffffff] shadow-lg rounded-3xl p-8 flex flex-col", className)}>
    <div className="w-16 h-16 mb-4 flex items-center justify-center text-primary text-4xl">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-primary mb-2 text-left">{header}</h3>
    <p className="text-gray-600 text-left">{description}</p>
  </div>
);

// ----------------- Navbar Component ------------------
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-navbar shadow-md w-full absolute top-0 left-0 z-50 flex items-center justify-between px-6 xl:px-40">
      <button onClick={() => (window.location.href = "/")}>
        <img src={logo} alt="logo" width={160} className="xl:w-[200px]" />
      </button>

      {/* Burger Menu */}
      <div className="xl:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none" aria-label="Open menu">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 8h24M4 16h24M4 24h24" />
          </svg>
        </button>
      </div>

      {/* Links */}
      <div className={clsx(
        "absolute xl:static top-16 left-0 w-full xl:w-auto bg-navbar xl:bg-transparent transition-all duration-200 z-40",
        menuOpen ? "block" : "hidden",
        "xl:block"
      )}>
        <ul className="flex flex-col xl:flex-row xl:space-x-6 text-2xl items-center">
          {["Инструменты", "Как это работает", "Блог", "Помощь"].map((label, i) => (
            <li key={i}>
              <a href="/" className="px-4 py-2 transition rounded-xl hover:bg-[#6d7487] block">{label}</a>
            </li>
          ))}
          <li>
            <button className="bg-primary text-[#ffffff] rounded-xl py-4 px-6 text-white transition hover:bg-[#6d7487] w-full xl:w-auto">
              Начать
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-30 xl:hidden" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
};

// ----------------- Hero Section ------------------
const HeroSection = () => (
  <header className="flex items-center justify-between w-full px-6 xl:px-40 mt-[200px]">
    <div className="flex flex-col justify-center mt-20 text-left gap-y-8">
      <h1 className="max-sm:text-3xl text-primary text-7xl font-bold">Говорим с властью</h1>
      <h3 className="max-sm:text-sm text-xl text-primary max-w-[700px]">
        Создавайте официальные письма, обращения и запросы на казахском или русском — за считанные минуты.
        <br />
        Kenes AI помогает правильно сформулировать идею, соблюсти стиль и ссылаться на нужные законы.
      </h3>
      <div className="flex gap-x-5">
        <button className="bg-primary text-[#ffffff] p-4 px-8 rounded-3xl text-white font-medium text-lg transition hover:bg-[#6d7487]">
          Начать работу
        </button>
        <button
          className="text-primary p-4 px-8 rounded-3xl font-medium text-lg border-2 transition-all hover:border-primary"
          style={{
            boxShadow: "0 0 0 2px transparent",
            borderColor: "currentColor",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px currentColor")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px transparent")}
        >
          Посмотреть функцию
        </button>
      </div>
    </div>

    <div className="ml-10 rounded-lg shadow-lg overflow-hidden hidden xl:block">
      <img src={man} alt="man" width={300} />
    </div>
  </header>
);

// ----------------- Features Section ------------------
const features = [
  {
    icon: <MessageCircle />,
    header: "Конструктор писем",
    description:
      "Создавайте официальные письма, обращения и запросы за несколько минут. Просто заполните форму — и получите документ, готовый к отправке в госорганы.",
    className: "col-start-1 col-end-5 row-start-1 row-end-3",
  },
  {
    icon: <User2 />,
    header: "Проверка стиля и тона",
    description:
      "Получите моментальную обратную связь по стилю, структуре и тону текста. Убедитесь, что ваше письмо соответствует ожиданиям чиновников и организаций.",
    className: "col-start-5 col-end-7 row-start-1 row-end-3",
  },
  {
    icon: <CheckCircle />,
    header: "Советник по аргументации",
    description:
      "Задавайте юридические вопросы и получайте ответы от AI на основе актуального законодательства РК. Используйте реальные ссылки на законы, чтобы усилить свои обращения.",
    className: "col-start-1 col-end-3 row-start-3 row-end-5",
  },
  {
    icon: <StarsIcon />,
    header: "Симулятор переговоров",
    description:
      "Потренируйтесь вести диалог с виртуальным чиновником. Подготовьтесь к встречам, научитесь правильно реагировать и формулировать свои аргументы уверенно.",
    className: "col-start-3 col-end-7 row-start-3 row-end-5",
  },
];

const FeaturesSection = () => (
  <section className="bg-[#f8f4f0] w-full mt-[300px] flex flex-col items-center">
    <div className="flex flex-col items-center justify-center max-w-8xl mx-auto py-20 px-6 xl:px-40 gap-y-4">
      <h1 className="text-4xl max-w-4xl text-center font-semibold text-primary">
        Функции, созданные для официального общения в Казахстане
      </h1>
      <p className="text-primary opacity-50 text-2xl text-center max-w-4xl">
        Откройте для себя инструменты, которые помогут вам легко создавать,
        проверять и усиливать документы для общения с государственными
        органами. Каждая функция адаптирована под правовые и административные
        стандарты Казахстана — чтобы вы могли выражаться ясно и уверенно.
      </p>
    </div>

    <div className="grid grid-cols-6 grid-rows-4 gap-3 max-w-7xl">
      {features.map((feature, i) => (
        <Card key={i} {...feature} />
      ))}
    </div>
  </section>
);

// ----------------- LandingPage ------------------
const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

export default LandingPage;
