import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"; 

interface User {
  id: number;
  role: string;
  email: string;
  name: string;
  username: string;
  mobile: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async (userId: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  const login = (accessToken: string) => {
    try {
      Cookies.set('token', accessToken, { expires: 15 });
      const decodedToken: { sub: string } = jwtDecode<{ sub: string }>(accessToken); 
      if (decodedToken.sub) {
        setIsLoggedIn(true);
        fetchUserData(Number(decodedToken.sub));
      } else {
        throw new Error('Invalid token structure');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      logout();
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    Cookies.remove('token');
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken: { sub: string } = jwtDecode<{ sub: string }>(token); 
        if (decodedToken.sub) {
          setIsLoggedIn(true);
          fetchUserData(Number(decodedToken.sub));
        } else {
          throw new Error('Invalid token structure during initialization');
        }
      } catch (error) {
        console.error('Error decoding token during initialization:', error);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
