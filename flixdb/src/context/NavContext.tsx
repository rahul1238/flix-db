import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NavContextProps {
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
}

const NavContext = createContext<NavContextProps | undefined>(undefined);

export const useNavContext = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNavContext must be used within a NavProvider');
  }
  return context;
};
interface NavProviderProps {
  children: ReactNode;
}

export const NavProvider: React.FC<NavProviderProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <NavContext.Provider value={{ drawerOpen, toggleDrawer }}>
      {children}
    </NavContext.Provider>
  );
};
