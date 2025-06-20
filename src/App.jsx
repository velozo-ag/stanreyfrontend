import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Login } from './pages/Login';
import { Signin } from './pages/Signin';
import { Carrito } from './pages/Carrito';
import { Catalogo } from './pages/Catalogo';
import AdminDashboard from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import './App.css'
import { Footer } from './components/Footer';

const PrivateRoute = ({ children, requiredProfileId }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredProfileId && user.perfilId !== requiredProfileId) {
    // return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/signin" element={<Signin />} />
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
        <Footer></Footer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;