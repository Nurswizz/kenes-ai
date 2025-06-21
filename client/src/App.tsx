import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<h1>About Us</h1>} />
        <Route path="/contact" element={<h1>Contact Us</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
