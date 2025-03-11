import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { getUserByID } from '../services/usuario';

interface PerfilUsuario {
  NombreUsuario: string;
  idPerfilUsuario: number;
}
interface UserData {
  idUsuario: number;
  Access_token: string;
  Correo: string;
  Nombre: string;
  Perfil: PerfilUsuario;
  ImagenPerfil?: string;
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
  const currentUserSession = () => !!localStorage.getItem('user');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    currentUserSession()
  );
  const [currentUser, setCurrentUser] = useState<UserData | undefined>();

  const loggedUserInfo = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setCurrentUser(undefined);
      return;
    }

    const storedUser: UserData = JSON.parse(user);

    const loggedUser = await getUserByID(storedUser.idUsuario);
    setCurrentUser(loggedUser.data);
  };

  const startSession = async (userData: UserData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    await loggedUserInfo();
  };

  const endSession = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(undefined);
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user).data);
    }
  }, []);

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
