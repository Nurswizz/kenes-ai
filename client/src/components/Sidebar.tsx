import logo from "../assets/logo.png";

const Sidebar = () => {
  return (
    <div className="bg-navbar text-white h-full w-64 fixed top-0 left-0 flex flex-col space-y-4">
        <button onClick={() => window.location.href = '/'} className="flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-64 h-auto" />
        </button>
      <div className="flex flex-col h-full justify-evenly text-3xl pl-5">
        <a href="/dashboard">Dashboard</a>
        <a href="#">Letter Builder</a>
        <a href="#">Style Checker</a>
        <a href="#">Advisor Chat</a>
        <a href="#">Simulator Chat</a>
      </div>
    </div>
  );
};

export default Sidebar;
