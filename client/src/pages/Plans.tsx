import Sidebar from "../components/Sidebar";

interface PlanInfo {
  title: string;
  description: string;
  price: number;
}
/*
4,500/мес
Подходит для индивидуальных пользователей и небольших команд
Начать сейчас
Без долгосрочных обязательств
Продвинутый
₸9,000/мес
Идеально для бизнеса и НПО
Выбрать тариф
Месячная оплата.
Полная поддержка.
*/
const Plan = ({ title, description, price }: PlanInfo) => {
  return (
    <div className="flex flex-col lg:flex-row p-5 bg-navbar text-primary rounded-xl w-96 min-h-[24rem] shadow-lg justify-between">
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2">{description}</p>
      </div>
      <div className="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-4 justify-end">
        <p className="font-bold">
          {price === 0 ? "Free" : `${price}₸/month`}
        </p>
        <button className="bg-primary text-white py-2 px-4 rounded transition-colors hover:bg-darkerNavbar">
          Select Plan
        </button>
      </div>
    </div>
  );
};

const Plans = () => {
  return (
    <div className="flex h-full lg:h-screen flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 p-6 flex items-center flex-col">
        <h1 className="text-4xl font-bold">Plans</h1>
        <p>Choose a plan that fits your needs.</p>
        <div className="flex h-full justify-evenly items-center w-full px-32 pt-8 lg:pt-0 flex-col lg:flex-row gap-8">
          <Plan
            title="Базовый"
            description="Подходит для индивидуальных пользователей и небольших команд"
            price={4500}
          />
          <Plan
            title="Продвинутый"
            description="Идеально для бизнеса и НПО"
            price={9000}
          />
        </div>
      </div>
    </div>
  );
};

export default Plans;
