import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import useApi from "../hooks/useApi";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Triangle } from "lucide-react";

type FeatureKey = "letter" | "style" | "chat";

interface IUsageRecord {
  userId: string;
  featureKey: FeatureKey;
  usedAt: Date;
  meta?: {
    pdf_url?: string;
  };
}

interface IFeature {
  title: string;
  num?: number;
}

interface IActivity {
  title: string;
  date: Date;
  id: string;
  meta?: {
    pdf_url?: string;
  };
}

const Feature = ({ title, num }: IFeature) => {
  const isLoading = typeof num !== "number";
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2">
      <div className="w-full h-[120px] px-6 py-4 rounded-xl shadow-md bg-[#dfdfdf] flex flex-col justify-center">
        <h3 className="text-base md:text-lg text-gray-700">{title}</h3>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">
          {isLoading ? <LoaderCircle className="animate-spin w-6 h-6" /> : num}
        </h1>
      </div>
    </div>
  );
};

const Activity = ({ title, date, meta }: IActivity) => {
  const { t } = useTranslation();
  const formattedTitle = t(`feature.${title}`);
  let message = ""
  if (localStorage.getItem("language") === "ru") {
    message = `Использована функция ${formattedTitle}`;
  } else if (localStorage.getItem("language") === "en") {
    message = `Used feature ${formattedTitle}`;
  }
  const formattedDate = date.toLocaleDateString();
  return (
    <div
      onClick={() => meta?.pdf_url && window.open(meta.pdf_url, "_blank")}
      className="w-full flex flex-col hover:bg-[#cdcdcd] cursor-pointer p-3 rounded-lg transition-colors"
    >
      <h1>{message}</h1>
      <h3>{formattedDate}</h3>
    </div>
  );
};

const Dashboard = () => {
  const [categorizedUsage, setCategorizedUsage] = useState<
    Record<FeatureKey, IUsageRecord[]>
  >({
    letter: [],
    style: [],
    chat: [],
  });
  const [recentActivity, setRecentActivity] = useState<IActivity[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const { fetchData } = useApi();
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  useEffect(() => {
    const fetchUsage = async () => {

      try {
        const usageData = await fetchData<{ usageRecords: IUsageRecord[] }>(
          "/users/usage"
        );

        const grouped = usageData.usageRecords.reduce(
          (acc, rec) => {
            acc[rec.featureKey] = [...(acc[rec.featureKey] || []), rec];
            return acc;
          },
          {
            letter: [],
            style: [],
            chat: [],
          } as Record<FeatureKey, IUsageRecord[]>
        );
        // show the latest 5 records overall
        
        const recent = usageData.usageRecords.reverse()
          .map((rec) => {
            return {
              title: rec.featureKey,
              date: new Date(rec.usedAt),
              id: `${rec.userId}-${rec.featureKey}-${rec.usedAt}`,
              meta: rec.meta || {},
            }
      });

        setCategorizedUsage(grouped);
        setRecentActivity(recent);
      } catch (err) {
        console.error("Failed to fetch usage data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, []);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoaderCircle className="animate-spin w-8 h-8 text-primary" />
        </div>
      </div>
    );
  }
  const letterCount = categorizedUsage.letter.length;
  const styleCount = categorizedUsage.style.length;
  const chatCount = categorizedUsage.chat.length;

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">{t("dashboard")}</h1>

        {/* Features */}
        <div className="flex flex-wrap -mx-2">
          <Feature title={t("letters-drafted")} num={letterCount} />
          <Feature title={t("style-checked")} num={styleCount} />
          <Feature title={t("chat-uses")} num={chatCount} />
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col gap-3 mt-6">
          <button className="flex items-center gap-2 py-2" onClick={toggleShowAll}>
              <h1 className="text-3xl sm:text-4xl font-bold">{t("recent-activity")}</h1>
              <Triangle size={24} className={`transform ${showAll ? "rotate-180" : ""} mt-2`} />
          </button>
          <div className="flex flex-col gap-5 mb-12">
            {recentActivity.length > 0 ? (
              showAll ? (
                recentActivity.map((activity) => (
                  <Activity
                    id={activity.id}
                    key={activity.id}
                    title={activity.title}
                    date={activity.date}
                    meta={activity.meta}
                  />
                ))
              ) : (
                recentActivity.slice(0, 5).map((activity) => (
                  <Activity
                    id={activity.id}
                    key={activity.id}
                    title={activity.title}
                    date={activity.date}
                    meta={activity.meta}
                  />
                ))
              )
            ) : (
              <div className="text-gray-500">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
