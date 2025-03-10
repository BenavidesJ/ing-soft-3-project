import { Navigate, Route, Routes } from 'react-router';
import { Login, Register } from './pages/public';
import { Dashboard } from './pages/private';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Rutas publicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Rutas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
