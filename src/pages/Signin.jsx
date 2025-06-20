import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Signin = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const success = await login(usuario, password);

        if (success) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user.perfilId === 1) {
                navigate('/admin/productos');
            } else {
                navigate('/');
            }
        } else {
            setError('Usuario o password incorrectos');
        }
    };

    return (
        <div className='login'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <p>Ingresa usuario y password para continuar. </p>
                <div className="form-group">
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-label">{error}</div>}
                <button type="submit">Iniciar Sesión</button>
            </form>

        </div>
    );
};