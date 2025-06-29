import useApi from "../hooks/useApi";

import Sidebar from "../components/Sidebar";

const StyleChecker = () => {
  const { fetchData } = useApi();

  return (
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
            <div className="bg-navbar flex flex-col items-center w-[50%] h-[80%] rounded-lg shadow-2xl">
                <h1 className="text-4xl font-bold  p-4">Style Checker</h1>
                <input type="text" className="border-2 border-gray-300 p-2 rounded-lg" />
            </div>
        </div>
    </div>
  )
};

export default StyleChecker;
