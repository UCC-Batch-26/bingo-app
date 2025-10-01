import { BrowserRouter, Routes, Route } from 'react-router';
import { LandingPage } from './modules/home/pages/landing-page';
import { LobbyPage } from './modules/Lobby/Pages/lobby-page';
import { RoomPage } from './modules/Room/Pages/room-page';
import { NotFoundPage } from './modules/common/Pages/not-found-page';
import { UnauthorizedPage } from './modules/common/Pages/unauthorized-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
