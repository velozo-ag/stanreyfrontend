import { useEffect, useContext, useState } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Producto } from '../models/Producto';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { ProductoForm } from '../components/ProductoForm';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [productoEditando, setProductoEditando] = useState(null);
    const [formMode, setFormMode] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await api.get('/categoria/lista');
                setCategorias(response.data);
                console.log('Categorias:', response.data);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
                setError('Error al cargar categorías');
            }
        };

        fetchProductos();
        fetchCategorias();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await api.get('/producto/lista');
            setProductos(response.data);
            console.log('Productos:', response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('Error al cargar productos');
        }
    };

    const handleForm = (e) => {
        e.preventDefault();
        if (formMode == '') {
            setFormMode('-open');
        } else {
            setFormMode('');
        }
    }

    const handleStateChange = async (e, prod) => {
        e.preventDefault();

        const confirmacion = window.confirm(
            prod.estado === 1
                ? `¿Estás seguro de dar de baja el producto "${prod.nombre}"?`
                : `¿Estás seguro de dar de alta el producto "${prod.nombre}"?`
        );

        if (!confirmacion) return;

        try {
            const endpoint = prod.estado === 1
                ? '/it_admin/producto/baja/' + prod.idProducto
                : '/it_admin/producto/alta/' + prod.idProducto;

            await api.put(endpoint);
            fetchProductos();
        } catch (error) {
            setError(`Error al cambiar estado de: ${prod.nombre}`);
        }
    };


    return (
        <div className="admindashboard">
            <h2>Admin Dashboard <br></br>
                Productos
            </h2>
            <nav className="options">
                <ul>
                    <li>
                        <Link onClick={(e) => handleForm(e)} className="button">
                            + Agregar Producto
                        </Link>
                    </li>
                </ul>
            </nav>
            {productos.filter((prod) => prod.estado === 1).length === 0 ? (
                <p>No hay productos activos</p>) :
                (<table className="table">
                    <caption>Productos Activos</caption>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>ID</th>
                            <th>Nombre/Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Administrar</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productos.filter((prod) => prod.estado === 1).map((prod) => (
                            <tr key={prod.idProducto}>
                                <td>
                                    {prod.urlImagen ? (
                                        <img
                                            src={'http://localhost:8080/stanrey/producto/imagen/' + prod.urlImagen}
                                            alt={prod.nombre}
                                            style={{ width: '50px', height: '50px' }}
                                        />

                                    ) : (
                                        'Sin imagen'
                                    )}
                                </td>
                                <td>{prod.idProducto}</td>
                                <td>
                                    {prod.nombre} / {prod.categoria?.descripcion || 'Sin categoría'}
                                </td>
                                <td>${prod.precio}</td>
                                <td>{prod.stock}</td>
                                <td>
                                    <button onClick={(e) => handleStateChange(e, prod)}
                                        className='baja-button'>Baja</button>
                                    <button
                                        className='modificar-button'
                                        onClick={() => {
                                            setProductoEditando(prod);
                                            setFormMode('-open');
                                        }}
                                    >
                                        Modificar
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>)}

            {productos.filter((prod) => prod.estado === 0).length === 0 ? (
                <p>No hay productos inactivos</p>) :
                (<table className="table">

                    <caption>Productos de baja</caption>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>ID</th>
                            <th>Nombre/Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Administrar</th>
                        </tr>
                    </thead>
                    <tbody>

                        {productos.filter((prod) => prod.estado === 0).map((prod) => (
                            <tr key={prod.idProducto}>
                                <td>
                                    {prod.urlImagen ? (
                                        <img
                                            src={'http://localhost:8080/stanrey/producto/imagen/' + prod.urlImagen}
                                            alt={prod.nombre}
                                            style={{ width: '50px', height: '50px' }}
                                        />

                                    ) : (
                                        'Sin imagen'
                                    )}
                                </td>
                                <td>{prod.idProducto}</td>
                                <td>
                                    {prod.nombre} / {prod.categoria?.descripcion || 'Sin categoría'}
                                </td>
                                <td>${prod.precio}</td>
                                <td>{prod.stock}</td>
                                <td>
                                    <button onClick={(e) => handleStateChange(e, prod)}
                                        className='alta-button'>Alta</button>
                                    <button
                                        className='modificar-button'
                                        onClick={() => {
                                            setProductoEditando(prod);
                                            setFormMode('-open');
                                        }}
                                    >
                                        Modificar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>)}

            <ProductoForm
                formFunctions={[formMode, setFormMode, setProductos, fetchProductos]}
                productoEditando={productoEditando}
                setProductoEditando={setProductoEditando}
            />
        </div >
    );
};

export default AdminDashboard;