import { createContext, useContext, useState, ReactNode } from 'react';
import { getUserByID } from '../services/usuario';

interface UserData {
  accessToken: string;
}

interface AuthContextProps {
  currentUser: UserData | undefined;
  isAuthenticated: boolean;
  startSession: (userData: UserData) => void;
  endSession: () => void;
  setCurrentUser: (value: React.SetStateAction<UserData | undefined>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const currentUserSession = () => !!sessionStorage.getItem('user');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    currentUserSession()
  );
  const [currentUser, setCurrentUser] = useState<UserData | undefined>();

  const loggedUserInfo = async () => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      setCurrentUser(undefined);
      return;
    }
    const userID = JSON.parse(user).data.idUsuario;
    const loggedUserInfo = await getUserByID(userID);
    setCurrentUser(loggedUserInfo.data);
  };

  const startSession = async (userData: UserData) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    await loggedUserInfo();
  };

  const endSession = () => {
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        startSession,
        endSession,
        isAuthenticated,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
