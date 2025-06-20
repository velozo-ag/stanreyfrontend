import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Carrito = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [productos, setProductos] = useState();

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [resProd, resCat] = await Promise.all([
                    api.get('/producto/lista'),
                    api.get('/categoria/lista')
                ]);
                setProductos(resProd.data);
                setCategorias(resCat.data);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar productos o categorías');
            }
        };

        fetchDatos();
    }, []);

    return (
        <div className='carrito'>

        </div>
    );
};