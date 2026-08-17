//mainly responsable for routing

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import EventSetup from "./pages/EventSetup";
import Matches from "./pages/Matches";
import Match from "./pages/Match";
import Anomalies from "./pages/Anomalies";
import Teams from "./pages/Teams";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/setup" element={<EventSetup />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/matches/:matchId" element={<Match />} />
        <Route path="/anomalies" element={<Anomalies />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:teamNumber" element={<Teams />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;