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
  Nombre: string;
  Apellido1: string;
  Apellido2?: string;
  Correo: string;
  Activo: boolean;
  Fecha_creacion?: string;
  Fecha_modificacion?: string;
  Perfil?: PerfilUsuario;
  Access_token?: string;
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

  // const loggedUserInfo = async () => {
  //   const user = localStorage.getItem('user');
  //   if (!user) {
  //     setCurrentUser(undefined);
  //     return;
  //   }

  //   const storedUser: UserData = await JSON.parse(user);
  //   console.log('JBO debug usuario', { storedUser, id: storedUser.idUsuario });

  //   const loggedUser = await getUserByID(storedUser && storedUser);
  //   setCurrentUser(loggedUser.data as unknown as UserData);
  // };

  const startSession = async (userData: UserData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    // await loggedUserInfo();
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
