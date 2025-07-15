import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import StyleChecker from "./pages/StyleChecker";
import LetterBuilder from "./pages/LetterBuilder";
import Advisor from "./pages/AdvisorChat";
import Simulator from "./pages/Simulator";
import SimulatorChat from "./pages/SimulatorChat";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

          <Route path="/dashboard" element={ <ProtectedRoute ><Dashboard /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute ><Account /></ProtectedRoute>} />
          <Route path="/tools/letter-builder" element={<ProtectedRoute ><LetterBuilder /></ProtectedRoute>} />
          <Route path="/tools/style-checker" element={<ProtectedRoute ><StyleChecker /></ProtectedRoute>} />
          <Route path="/tools/advisor" element={<ProtectedRoute ><Advisor /></ProtectedRoute>} />
          <Route path="/tools/simulator" element={<ProtectedRoute ><Simulator /></ProtectedRoute>} />
          <Route path="/tools/simulator/:id" element={<SimulatorChat />} />
          <Route path="/plans" element={<h1>Plans</h1>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
