import { Route, Routes } from 'react-router';
import './App.css';
import { Login, Register } from './pages/public';

function App() {
  return (
    <Routes>
      <Route
        index
        element={
          <>
            <h1>Home</h1>
          </>
        }
      />
      <Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
