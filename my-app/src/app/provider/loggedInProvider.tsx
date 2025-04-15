"use client";
import React, { createContext, useState, useContext, Dispatch } from 'react';

interface ContextProps {
    isLoggedIn: boolean,
    setIsLoggedIn?: Dispatch<any>
}

const LoggedInContext = createContext<ContextProps>({
    isLoggedIn: false
});

export const LoggedInProvider = ({ children }: {children: React.ReactNode}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <LoggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoggedInContext.Provider>
  );
};

export const useIsLoggedIn = () => {
  return useContext(LoggedInContext);
};