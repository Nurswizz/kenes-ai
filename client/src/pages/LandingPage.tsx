import React, { useState } from "react";
import clsx from "clsx";
import logo from "../assets/logo.png";
import man from "../assets/landing_page_man.png";
import { MessageCircle, User2, CheckCircle, StarsIcon } from "lucide-react";
import feedback_logo from "../assets/feedback.svg";
import { useMemberstack } from "../context/MemberstackProvider";
import useApi from "../hooks/useApi";

type CardProps = {
  icon: React.ReactNode;
  header: string;
  description: string;
  className?: string;
};

const handleStart = async <T = unknown>(
  fetchData: (endpoint: string, options?: RequestInit) => Promise<T>,
  memberstackInstance: any
) => {
  try {
    const member = await memberstackInstance.getCurrentMember();

    if (member?.data) {
      console.log("User already logged in, redirecting:", member);
      window.location.href = "/dashboard";
      return;
    }

    const result = await memberstackInstance.openModal("SIGNUP", {
      signup: {
        plans: [import.meta.env.VITE_PLAN_FREE_ID!],
      },
    });

    if (!result || typeof result !== "object" || "data" !in result) return;

    const memberRefetched = await memberstackInstance.getCurrentMember();
    const memberDataObj = memberRefetched?.data;

    if (!memberDataObj) {
      console.error("Failed to fetch member data after signup");
      return;
    }

    const memberData = {
      id: memberDataObj.id,
      email: memberDataObj?.auth?.email,
      firstName: memberDataObj?.customFields?.["first-name"],
      lastName: memberDataObj?.customFields?.["last-name"],
      memberstackId: memberDataObj?.id,
      plan: memberDataObj?.planConnections?.[0]?.type ?? "FREE",
    };

    localStorage.setItem("user", JSON.stringify(memberData));

    await fetchData("/auth/sync-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memberData),
    });

    if (memberData.id) {
      window.location.href = "/dashboard";
    } else {
      console.error("Member ID missing — cannot redirect.");
    }
  } catch (err) {
    console.error("Signup error:", err);
  }
};


const Card = ({ icon, header, description, className }: CardProps) => (
  <div
    className={clsx(
      "bg-[#ffffff] shadow-lg rounded-3xl p-8 flex flex-col",
      className
    )}
  >
    <div className="flex items-center mb-5 text-primary text-4xl">{icon}</div>
    <h3 className="text-xl font-semibold text-primary mb-2 text-left">
      {header}
    </h3>
    <p className="text-gray-600 text-left">{description}</p>
  </div>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { fetchData } = useApi();
  const memberstack = useMemberstack();
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
                handleStart(fetchData, memberstack);
              }}
              className="bg-primary text-[#ffffff] rounded-xl py-4 px-6 text-white transition hover:bg-[#6d7487] w-full xl:w-auto"
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

const Feedback = ({
  header,
  description,
  author,
  className,
}: {
  header: string;
  description: string;
  author: string;
  className?: string;
}) => (
  <div className={`p-6 bg-white rounded-xl shadow-md ${className}`}>
    <h1 className="text-xl sm:text-2xl font-semibold mb-3">{header}</h1>
    <p className="text-base sm:text-lg text-gray-700">{description}</p>
    <div className="mt-5 flex items-center gap-4 flex-wrap">
      <span className="text-sm sm:text-base font-bold text-gray-900">
        — {author}
      </span>
      <img src={feedback_logo} alt="360LAB" className="h-6 w-auto" />
    </div>
  </div>
);

const HeroSection = () => {
  const { fetchData } = useApi();
  const memberstack = useMemberstack();

  return (
    <header className="flex flex-col-reverse xl:flex-row items-center justify-between w-full px-4 sm:px-10 xl:px-40 py-20 gap-10 mt-20">
      {/* Текстовая часть */}
      <div className="flex flex-col justify-center text-left gap-y-6 max-w-2xl">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl text-primary font-bold leading-tight">
          Говорим с властью
        </h1>
        <h3 className="text-sm sm:text-lg lg:text-xl text-primary">
          Создавайте официальные письма, обращения и запросы на казахском или русском — за считанные минуты.  
          <br className="hidden sm:block" />
          Kenes AI помогает правильно сформулировать идею, соблюсти стиль и ссылаться на нужные законы.
        </h3>

        <div className="flex flex-wrap gap-4 mt-4">
          <button
            onClick={() => handleStart(fetchData, memberstack)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-medium text-base sm:text-lg transition hover:bg-[#6d7487]"
          >
            Начать работу
          </button>
          <button
            className="text-primary px-6 py-3 rounded-2xl font-medium text-base sm:text-lg border-2 border-primary transition-all hover:shadow-[0_0_0_2px_currentColor]"
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
};


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
  <section className="bg-[#f8f4f0] w-full mt-[300px] flex flex-col items-center pb-[100px] gap-4">
    {/* Заголовок и описание */}
    <div className="flex flex-col items-center justify-center w-full max-w-6xl px-4 sm:px-8 xl:px-40 gap-y-6 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary">
        Функции, созданные для официального общения в Казахстане
      </h1>
      <p className="text-sm sm:text-lg md:text-xl text-primary opacity-60">
        Откройте для себя инструменты, которые помогут вам легко создавать,
        проверять и усиливать документы для общения с государственными органами.
        Каждая функция адаптирована под правовые и административные стандарты
        Казахстана — чтобы вы могли выражаться ясно и уверенно.
      </p>
    </div>

    <div className="grid grid-cols-6 grid-rows-4 gap-3 max-w-7xl max-lg:flex max-lg:flex-col px-6 xl:px-40">
      {features.map((feature, i) => (
        <Card key={i} {...feature} />
      ))}
    </div>
  </section>
);

const SubscriptionSection = () => {
  const { fetchData } = useApi();
  const memberstack = useMemberstack();
  const plans = [
    {
      title: "Базовый",
      price: "₸4,500/мес",
      description:
        "Подходит для индивидуальных пользователей и небольших команд",
      buttonText: "Начать сейчас",
      subText: "Без долгосрочных обязательств",
    },
    {
      title: "Продвинутый",
      price: "₸9,000/мес",
      description: "Идеально для бизнеса и НПО",
      buttonText: "Выбрать тариф",
      subText: "Месячная оплата.\nПолная поддержка.",
    },
  ];

  return (
    <section className="mt-10 w-full px-4 lg:px-20">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-primary text-center mb-16">
        Простой и честный тариф для каждого
      </h1>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white border border-[#bebebe] rounded-3xl max-w-md w-full px-6 py-16 text-center shadow-2xl"
          >
            <h3 className="text-xl sm:text-2xl opacity-50">{plan.title}</h3>
            <h1 className="text-4xl sm:text-5xl my-2">{plan.price}</h1>
            <h3 className="text-lg sm:text-2xl opacity-75">
              {plan.description}
            </h3>
            <button
              onClick={() => handleStart(fetchData, memberstack)}
              className="mt-6 bg-primary px-8 py-3 text-lg sm:text-xl font-semibold text-white rounded-lg"
            >
              {plan.buttonText}
            </button>
            <h3 className="text-base sm:text-xl opacity-60 mt-6 whitespace-pre-line">
              {plan.subText}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

const FeedbackSection = () => {
  return (
    <section className="flex justify-center bg-[#f8f4f0] px-4 py-10 md:px-10">
      <div className="flex flex-col w-full max-w-7xl">
        <h1 className="text-left text-3xl sm:text-4xl mb-10 sm:mb-20 text-primary font-semibold">
          Отзывы наших пользователей
        </h1>

        {/* GRID на больших экранах, COLUMN на малых */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-4">
          <Feedback
            className="lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3"
            header="Мне нужно было составить официальное письмо для получения госгранта."
            description="Платформа помогла мне на каждом этапе — убедился, что заявление оформлено правильно и соответствует требованиям. Ответ пришёл быстро, и я был уверен в результате."
            author="Джамие Төлеген, предприниматель, Алматы"
          />
          <Feedback
            className="lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-3"
            header="Жалоба в акимат моего района прошла значительно проще с этой платформой"
            description="Инструкции были понятными, документ приняли без правок. Это сэкономило мне кучу времени и сил."
            author="Райли Садық, житель Шымкента"
          />
          <Feedback
            className="lg:col-start-2 lg:col-end-4 lg:row-start-3 lg:row-end-5"
            header="Как НПО, нам часто приходится общаться с министерствами."
            description="Эта платформа помогает структурировать обращения и заявки по всем официальным стандартам — работать стало быстрее и проще."
            author="Касей Аманжол, руководитель НПО, Астана"
          />
          <Feedback
            className="lg:col-start-4 lg:col-end-6 lg:row-start-3 lg:row-end-5"
            header="Госдокументы раньше вызывали стресс"
            description="Теперь я могу быстро подготовить всё — на казахском или русском, зная, что стиль и формат соответствуют требованиям."
            author="Жордан Бекетов, фрилансер, Караганда"
          />
        </div>
      </div>
    </section>
  );
};

const faqData = [
  {
    question: "Для кого предназначена эта платформа?",
    answer:
      "Для всех в Казахстане — граждан, предпринимателей, НПО и организаций. Сервис помогает создавать официальные письма и обращения в госорганы. Юридическое образование не требуется.",
  },
  {
    question: "Какие документы я могу создать?",
    answer:
      "Формальные письма, жалобы, заявления на субсидии, запросы, предложения и другие официальные документы. Все тексты соответствуют тону и структуре, принятым в казахстанских госорганах.",
  },
  {
    question: "Есть ли поддержка казахского и русского языка?",
    answer:
      "Да, платформа работает на двух языках. Документы автоматически адаптируются под официальный стиль и терминологию.",
  },
  {
    question: "Нужны ли мне юридические знания?",
    answer:
      "Нет. Платформа ведёт вас шаг за шагом, давая подсказки, формулировки и примеры. Вы просто отвечаете на вопросы и получаете готовый текст.",
  },
];


const FaqSection = () => {
  return (
    <section className="flex flex-col gap-12 px-4 sm:px-10 xl:px-40 py-16 w-full">
      {/* Заголовок */}
      <div className="flex flex-col gap-6 text-center lg:text-left">
        <h3 className="text-sm sm:text-base text-primary opacity-50">
          ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
        </h3>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold max-w-4xl">
          Ваши вопросы о нашем юридическом помощнике — с ответами
        </h1>
        <p className="text-base sm:text-lg max-w-3xl text-gray-600">
          Получите чёткие и понятные ответы о том, как использовать наш AI‑сервис для создания официальных документов и общения с госорганами Казахстана.
        </p>
      </div>

      {/* Вопросы */}
      <div className="flex flex-col divide-y divide-gray-300">
        {faqData.map(({ question, answer }, i) => (
          <div
            key={i}
            className="flex flex-col lg:flex-row justify-between py-8 gap-y-6"
          >
            <p className="text-lg sm:text-xl font-medium lg:max-w-[30%]">
              {question}
            </p>
            <p className="text-base sm:text-lg text-gray-700 lg:max-w-[60%]">
              {answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};


const ComplementarySection = () => {
  const { fetchData } = useApi();
  const memberstack = useMemberstack();

  return (
    <section className="w-full bg-[#f8f4f0] py-16 px-4 sm:px-10 xl:px-40 flex flex-col lg:flex-row items-center justify-between gap-10">
      {/* Левая часть — текст */}
      <div className="flex flex-col gap-4 text-center lg:text-left max-w-2xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary leading-snug">
          Создавайте официальные документы за минуты
        </h1>
        <p className="text-base sm:text-xl opacity-70">
          Генерируйте письма, обращения и запросы на казахском или русском — готовые к отправке в государственные органы и организации.
        </p>
      </div>

      {/* Правая часть — кнопки */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <button
          onClick={() => handleStart(fetchData, memberstack)}
          className="bg-primary text-white rounded-xl py-3 px-6 font-semibold text-base sm:text-lg transition hover:bg-[#6d7487] w-full"
        >
          Начать
        </button>
        <button
          className="text-primary border-2 border-primary rounded-xl py-3 px-6 font-medium text-base sm:text-lg transition-all hover:shadow-[0_0_0_2px_currentColor] w-full"
        >
          Посмотреть возможности
        </button>
      </div>
    </section>
  );
};


// const Footer = () => {
//   return (
//     <footer className="w-full flex justify-between">
//       <div>
//         <img src={logo} alt="logo" />
//         <div>
//           <ul>
//             <li></li>
//           </ul>
//         </div>
//       </div>
//       <div></div>
//       <div></div>
//       <div></div>
//     </footer>
//   );
// };

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SubscriptionSection />
      <FeedbackSection />
      <FaqSection />
      <ComplementarySection />
    </div>
  );
};

export default LandingPage;
