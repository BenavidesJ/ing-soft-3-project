import { Navigate, Route, Routes } from 'react-router';
import { Suspense, lazy } from 'react';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { LoadingOverlay } from './components';

// Lazy load public pages (named exports)
const Login = lazy(() =>
  import('./pages/public/Login').then((module) => ({ default: module.Login }))
);
const Register = lazy(() =>
  import('./pages/public/Register').then((module) => ({
    default: module.Register,
  }))
);
const RestorePassword = lazy(() =>
  import('./pages/public/RestorePassword').then((module) => ({
    default: module.RestorePassword,
  }))
);

// Lazy load private pages (named exports)
const Dashboard = lazy(() =>
  import('./pages/private/Dashboard').then((module) => ({
    default: module.Dashboard,
  }))
);
const GestionProyectos = lazy(() =>
  import('./pages/private/GestionProyectos').then((module) => ({
    default: module.GestionProyectos,
  }))
);
const DetalleProyecto = lazy(() =>
  import('./pages/private/DetalleProyecto').then((module) => ({
    default: module.DetalleProyecto,
  }))
);
const GestionTareas = lazy(() =>
  import('./pages/private/GestionTareas').then((module) => ({
    default: module.GestionTareas,
  }))
);
const GestionUsuarios = lazy(() =>
  import('./pages/private/GestionUsuarios').then((module) => ({
    default: module.GestionUsuarios,
  }))
);
const Reportes = lazy(() =>
  import('./pages/private/Reportes').then((module) => ({
    default: module.Reportes,
  }))
);
const GestionRecursos = lazy(() =>
  import('./pages/private/GestionRecursos').then((module) => ({
    default: module.GestionRecursos,
  }))
);

function App() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<RestorePassword />} />

        {/* Private Routes */}
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
          path="/proyecto/:id"
          element={
            <PrivateRoute>
              <DetalleProyecto />
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
          path="/gestion-recursos"
          element={
            <PrivateRoute>
              <GestionRecursos />
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
      </Routes>
    </Suspense>
  );
}

export default App;
