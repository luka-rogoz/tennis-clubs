import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ClubManager from "./components/ClubManager";
import CoachManager from "./components/CoachManager";
import PlayerManager from "./components/PlayerManager";
import DoubleManager from "./components/DoubleManager";
import TournamentManager from "./components/TournamentManager";
import Home from "./components/Home";
import NavigationBar from "./components/NavigationBar";
import ClubDetail from "./components/ClubDetail";
import CoachDetail from "./components/CoachDetail";
import PlayerDetail from "./components/PlayerDetail";
import DoubleDetail from "./components/DoubleDetail";
import TournamentDetail from "./components/TournamentDetail";
import TransactionManager from "./components/TransactionManager";
import MeetingManager from "./components/MeetingManager";
import EquipmentManager from "./components/EquipmentManager";
import CourtManager from "./components/CourtManager";
import TrainingManager from "./components/TrainingManager";
import MatchManager from "./components/MatchManager";
import PlayerMatches from "./components/PlayerMatches";
import TransactionDetail from "./components/TransactionDetail";
import TrainingDetail from "./components/TrainingDetail";
import MeetingDetail from "./components/MeetingDetail";
import MatchDetail from "./components/MatchDetail";
import EquipmentDetail from "./components/EquipmentDetail";
import CourtDetail from "./components/CourtDetail";

function App() {
    document.title = "Aplikacija za teniske klubove"
  return (
    <div>
      <NavigationBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clubs" element={<ClubManager />} />
            <Route path="/clubs/:clubId" element={<ClubDetail />}/>
            <Route path="/clubs/:clubId/transactions" element={<TransactionManager />}/>
            <Route path="/clubs/:clubId/transactions/:transactionId" element={<TransactionDetail />}/>
            <Route path="/clubs/:clubId/meetings" element={<MeetingManager />}/>
            <Route path="/clubs/:clubId/meetings/:meetingId" element={<MeetingDetail />}/>
            <Route path="/clubs/:clubId/equipment" element={<EquipmentManager />}/>
            <Route path="/clubs/:clubId/equipment/:equipmentId" element={<EquipmentDetail />}/>
            <Route path="/clubs/:clubId/courts" element={<CourtManager />}/>
            <Route path="/clubs/:clubId/courts/:courtId" element={<CourtDetail />}/>
            <Route path="/coaches" element={<CoachManager />} />
            <Route path="/coaches/:coachId" element={<CoachDetail />}/>
            <Route path="/coaches/:coachId/training-sessions" element={<TrainingManager />} />
            <Route path="/coaches/:coachId/training-sessions/:trainingId" element={<TrainingDetail />}/>
            <Route path="/players" element={<PlayerManager />} />
            <Route path="/players/:playerId" element={<PlayerDetail />}/>
            <Route path="/players/:playerId/singles-matches" element={<PlayerMatches />} />
            <Route path="/doubles" element={<DoubleManager />} />
            <Route path="/doubles/:pairId" element={<DoubleDetail />}/>
            <Route path="/tournaments" element={<TournamentManager />} />
            <Route path="/tournaments/:tournamentId" element={<TournamentDetail />}/>
            <Route path="/tournaments/:tournamentId/matches" element={<MatchManager />}/>
            <Route path="/tournaments/:tournamentId/matches/:matchId" element={<MatchDetail />}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
