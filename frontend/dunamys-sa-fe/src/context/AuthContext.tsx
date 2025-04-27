import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface PerfilUsuario {
  NombreUsuario: string;
  idPerfilUsuario: number;
  urlImagenPerfil?: string;
}
interface UserData {
  idUsuario: number;
  Nombre: string;
  Apellido1: string;
  Apellido2?: string;
  Correo: string;
  Contrasena?: string;
  Activo: boolean;
  Fecha_creacion?: string;
  Fecha_modificacion?: string;
  Perfil?: PerfilUsuario;
  Access_token?: string;
  Roles?: any[];
}

interface AuthContextProps {
  currentUser: UserData | undefined;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
  const [hasAdminRights, setHasAdminRights] = useState<boolean>(false);

  const startSession = async (userData: UserData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify({ data: currentUser }));
    }
  }, [currentUser]);

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
  }, [isAuthenticated]);

  useEffect(() => {
    if (currentUser) {
      const isAdmin = currentUser.Roles?.some(
        (role) => role === 'ADMINISTRADOR'
      );
      setHasAdminRights(isAdmin || false);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        startSession,
        endSession,
        isAuthenticated,
        setCurrentUser,
        isAdmin: hasAdminRights,
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
