import logo from "../assets/logo.png";

const Sidebar = () => {
  return (
    <div className="bg-navbar text-white h-full w-64 relative top-0 left-0 flex flex-col border-r border-[#2C3E50]">
        <button onClick={() => window.location.href = '/'} className="flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-64 h-auto" />
        </button>
      <div className="flex flex-col h-full justify-between py-10 text-3xl pl-5">
        <a href="/dashboard" className="hover:text-[#5c5c5c] transition-all">Dashboard</a>
        <a href="/tools/letter-builder" className="hover:text-[#5c5c5c] transition-all">Letter Builder</a>
        <a href="/tools/style-checker" className="hover:text-[#5c5c5c] transition-all">Style Checker</a>
        <a href="/tools/advisor" className="hover:text-[#5c5c5c] transition-all">Advisor Chat</a>
        <a href="/tools/simulator" className="hover:text-[#5c5c5c] transition-all">Simulator Chat</a>
        <a href="/account" className="hover:text-[#5c5c5c] transition-all">Account</a>
      </div>
    </div>
  );
};

export default Sidebar;
