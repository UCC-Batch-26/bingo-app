import { BrowserRouter, Routes, Route } from 'react-router';
import { LandingPage } from './modules/home/pages/landing-page';
import { LobbyPage } from './modules/Lobby/Pages/lobby-page';
import { RoomPage } from './modules/Room/Pages/room-page';
import { NotFoundPage } from './modules/common/Pages/not-found-page';
import { UnauthorizedPage } from './modules/common/Pages/unauthorized-page';
import { RoomProvider } from './modules/Room/Contexts/room-context';
import { SessionProvider } from './modules/common/contexts/session-context';
import { CardProvider } from './modules/common/contexts/card-context';
import { SocketProvider } from './modules/common/contexts/socket-context';
import { BGMProvider } from './modules/common/contexts/bgm-context';

function App() {
  return (
    <BrowserRouter>
      <BGMProvider>
        <SocketProvider>
          <SessionProvider>
            <RoomProvider>
              <CardProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/lobby/:id" element={<LobbyPage />} />
                  <Route path="/room/:id" element={<RoomPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </CardProvider>
            </RoomProvider>
          </SessionProvider>
        </SocketProvider>
      </BGMProvider>
    </BrowserRouter>
  );
}

export default App;
