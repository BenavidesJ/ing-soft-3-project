import { Navigate, Route, Routes } from 'react-router';
import { Login, Register, RestorePassword } from './pages/public';
import {
  Dashboard,
  GestionProyectos,
  GestionTareas,
  GestionUsuarios,
  Reportes,
} from './pages/private';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Rutas publicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<RestorePassword />} />

        {/* Rutas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-proyectos"
          element={
            <PrivateRoute>
              <GestionProyectos />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-tareas"
          element={
            <PrivateRoute>
              <GestionTareas />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-usuarios"
          element={
            <PrivateRoute>
              <GestionUsuarios />
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute>
              <Reportes />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
