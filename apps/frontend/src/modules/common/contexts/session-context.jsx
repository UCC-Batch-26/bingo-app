import { createContext, useState } from 'react';
import { getData } from '@/services/api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [session, setSession] = useState({
    token: null,
    isHost: null,
    name: null,
    roomId: null,
    status: null,
    loading: true,
  });

  const navigate = useNavigate();
  const checkSession = async () => {
    try {
      const token = localStorage.getItem('sessionToken');
      if (!token) {
        setSession({ token: null, isHost: null, roomId: null, status: null, loading: false, name: false });
        navigate(`/`, { replace: true });
        return;
      }
      const data = await getData(`/room/verify/${token}`);

      if (!data) {
        console.warn('No active session found');
        setSession({ token: null, isHost: null, roomId: null, status: null, loading: false, name: false });
        localStorage.clear();
        return;
      }

      if (data.session === 'active') {
        setSession({
          token,
          isHost: data.isHost,
          roomId: data.roomId,
          status: data.status,
          loading: false,
        });

        if (data.status === 'lobby') {
          navigate(`/lobby/${data.roomId}`, { replace: true });
        } else if (data.status === 'live') {
          navigate(`/room/${data.roomId}`, { replace: true });
        }
      } else {
        setSession({ token: null, isHost: null, roomId: null, status: null, loading: false, name: false });
        navigate(`/`, { replace: true });
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setSession({ token: null, isHost: null, roomId: null, status: null, loading: false, name: false });
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>;
}

export default SessionContext;
