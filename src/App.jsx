import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Login } from './pages/Login';
import { Carrito } from './pages/Carrito';
import { Catalogo } from './pages/Catalogo';
import AdminDashboard from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import './App.css'
import { Footer } from './components/Footer';
import { Signup } from './pages/SignUp';

const PrivateRoute = ({ children, requiredProfileId }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredProfileId && user.perfilId !== requiredProfileId) {
    return <Navigate to="/catalogo" />;
  }

  return children;
};

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/carrito"
            element={
              <PrivateRoute requiredProfileId={3}>
                <Carrito />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <PrivateRoute requiredProfileId={1}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/catalogo" />} />
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;