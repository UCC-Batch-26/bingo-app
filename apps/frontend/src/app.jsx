import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LobbyPage from './Pages/LobbyPage';
import RoomPage from './Pages/RoomPage';
import NotFoundPage from './Pages/NotFoundPage';
import UnauthorizePage from './Pages/UnauthorizePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/unauthorized" element={<UnauthorizePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
