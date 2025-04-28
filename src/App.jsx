import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Login } from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import './App.css'

const PrivateRoute = ({ children, requiredProfileId }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredProfileId && user.perfilId !== requiredProfileId) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/productos"
            element={
              <PrivateRoute requiredProfileId={1}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;