import { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [myPageOpen, setMyPageOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ myPageOpen, setMyPageOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
