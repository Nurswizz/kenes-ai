import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import StyleChecker from "./pages/StyleChecker";
import LetterBuilder from "./pages/LetterBuilder";
import Advisor from "./pages/AdvisorChat";
import Simulator from "./pages/Simulator";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/tools/letter-builder" element={<LetterBuilder />} />
        <Route path="/tools/style-checker" element={<StyleChecker />} />
        <Route path="/tools/advisor" element={<Advisor />} />
        <Route path="/tools/simulator" element={<Simulator />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
