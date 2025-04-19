"use client";
import React, { createContext, useState, useContext, Dispatch } from 'react';

interface User {
  username: string;
  displayName: string;
}

interface ContextProps {
    isLoggedIn: boolean,
    setIsLoggedIn: Dispatch<any>,
    user?: User,
    setUser: Dispatch<any>
}

const UserContext = createContext<ContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: (() => {return null}),
    user: undefined,
    setUser: (() => {return null})
});

export const UserProvider = ({ children }: {children: React.ReactNode}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User|undefined>(undefined);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};