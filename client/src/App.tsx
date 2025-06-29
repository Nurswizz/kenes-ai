import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import StyleChecker from "./pages/StyleChecker";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/tools/letter-builder" element={<div>Letter Builder</div>} />
        <Route path="/tools/style-checker" element={<StyleChecker />} />
        <Route path="/tools/advisor" element={<div>Advisor Chat</div>} />
        <Route path="/tools/simulator" element={<div>Simulator Chat</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
