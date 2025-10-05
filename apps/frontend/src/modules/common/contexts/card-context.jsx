import { createContext, useState } from 'react';
import { getData, patchData } from '@/services/api';
import { useEffect } from 'react';

const CardContext = createContext();

export function CardProvider({ children }) {
  const [card, setCard] = useState({});
  const playerId = localStorage.getItem('playerId');

  const getCard = async (playerId) => {
    try {
      const cardData = await getData(`/card/${playerId}`);
      if (cardData) setCard(cardData);
    } catch (error) {
      console.error('Failed to fetch card:', error);
    }
  };

  const leaveRoom = async (playerId) => {
    try {
      const cardData = await patchData(`/card/${playerId}`, { room: '' });
      console.log(cardData);
      if (cardData) {
        setCard(cardData);
        localStorage.removeItem('playerId');
        localStorage.removeItem('sessionToken');
        window.dispatchEvent(new CustomEvent('sessionUpdated'));
        return true;
      }
    } catch (error) {
      console.error('Failed to leave:', error);
    }
  };

  useEffect(() => {
    if (playerId) getCard(playerId);
  }, [playerId]);

  return <CardContext.Provider value={{ card, getCard, leaveRoom }}>{children}</CardContext.Provider>;
}

export default CardContext;
