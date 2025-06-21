import { useState, useEffect } from 'react';
import api from '../api/api';

export const Catalogo = () => {
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

    return (
        <div className='catalogo'>
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
                            <span className='precio'>$ {prod.precio}</span> <br></br>
                            {prod.stock > 0 ? `Stock: ${prod.stock}` : 'Sin stock'}
                        </p>
                        <button
                            className='btn-comprar'
                            disabled={prod.stock === 0}
                        >
                            {prod.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
