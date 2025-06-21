import { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export const Catalogo = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

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

    const handleAgregarCarrito = async (productoId, precio) => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para agregar productos al carrito');
            return;
        }

        try {
            let carrito = await api.get(`/carrito/usuario/${user.idUsuario}`);
            let carritoId = carrito.data?.idCarrito;

            if (!carritoId) {
                const carritoDTO = {
                    fechaCreacion: new Date().toISOString(),
                    estado: 1,
                    usuarioId: user.idUsuario
                };
                const response = await api.post('/carrito/save', carritoDTO);
                carritoId = response.data;
            }

            const carritoProductoDTO = {
                fechaCreacion: new Date().toISOString(),
                cantidad: 1,
                precioUnitario: precio,
                carritoId,
                productoId
            };
            await api.post('/carrito/agregar-producto', carritoProductoDTO);
            alert('Producto agregado al carrito');
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            setError('Error al agregar producto al carrito: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='catalogo'>
            {error && <p className="error-label">{error}</p>}
            {productos.filter(p => p.estado === 1).map((prod) => (
                <div className='producto' key={prod.idProducto}>
                    <div className='image-container'>
                        <img
                            className='thumbnail'
                            src={`http://localhost:8080/stanrey/producto/imagen/${prod.urlImagen}`}
                            alt={prod.nombre}
                        />
                    </div>
                    <div className='info'>
                        <h2>{prod.nombre}</h2>
                        <p>
                            <span className='precio'>$ {prod.precio}</span> <br />
                            {prod.stock > 0 ? `Stock: ${prod.stock}` : 'Sin stock'}
                        </p>
                        <button
                            className='btn-comprar'
                            disabled={prod.stock === 0}
                            onClick={() => handleAgregarCarrito(prod.idProducto, prod.precio)}
                        >
                            {prod.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};