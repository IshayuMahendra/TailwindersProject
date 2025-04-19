"use client";
import React, { createContext, useState, useContext, Dispatch, useEffect } from 'react';

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

  //Set initial state
  useEffect(() => {
    fetch("http://localhost:3000/api/auth", {
      method: 'POST'
    }).then(async (response: Response) => {
      let jsonData = await response.json();
      setIsLoggedIn(jsonData.loggedIn);

      if(jsonData.isLoggedIn) {
        setUser({
          username: jsonData.user["username"],
          displayName: jsonData.user["display_name"]
        });
      }

    })
  }, [])

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};