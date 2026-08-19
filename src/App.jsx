// mainly responsible for routing

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventDataProvider } from "./context/EventDataContext";

import Home from "./pages/Home";
import EventSetup from "./pages/EventSetup";
import Matches from "./pages/Matches";
import Match from "./pages/Match";
import Anomalies from "./pages/Anomalies";
import Teams from "./pages/Teams";

function App() {
  return (
    <EventDataProvider>
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
    </EventDataProvider>
  );
}

export default App;