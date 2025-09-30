import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import LobbyPage from "../Pages/LobbyPage";
import RoomPage from "../Pages/RoomPage";
import UnauthorizedPage from "../Pages/UnauthorizedPage";
import NotFoundPage from "../Pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    index: true,
  },
  {
    path: "/lobby",
    element: <LobbyPage />,
  },
  {
    path: "/room/:roomId",
    element: <RoomPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
