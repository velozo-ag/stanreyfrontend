import { useEffect, useContext, useState } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { ProductoForm } from '../components/ProductoForm';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('productos');

    const [productos, setProductos] = useState([]);
    const [facturas, setFacturas] = useState([]);
    const [formMode, setFormMode] = useState('');
    const [productoEditando, setProductoEditando] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProductos();
        fetchFacturas();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await api.get('/producto/lista');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('Error al cargar productos');
        }
    };

    const fetchFacturas = async () => {
        try {
            const response = await api.get('/factura/lista');
            setFacturas(response.data);
        } catch (error) {
            console.error('Error al cargar facturas:', error);
            setError('Error al cargar facturas');
        }
    };

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
            <h2>Admin Dashboard</h2>

            <nav className="tab-nav">
                <button onClick={() => setActiveTab('productos')} className={activeTab === 'productos' ? 'active' : ''}>
                    Productos
                </button>
                <button onClick={() => setActiveTab('facturas')} className={activeTab === 'facturas' ? 'active' : ''}>
                    Facturas
                </button>
            </nav>

            {activeTab === 'productos' && (
                <>
                    <div className="options">
                        <button onClick={() => {
                            setFormMode('-open');
                            setProductoEditando(null);
                        }}>+ Agregar Producto</button>
                    </div>

                    {productos.filter(p => p.estado === 1).length === 0 ? (
                        <p>No hay productos activos</p>
                    ) : (
                        <table className="table">
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
                                {productos.filter(p => p.estado === 1).map(prod => (
                                    <tr key={prod.idProducto}>
                                        <td>
                                            {prod.urlImagen ? (
                                                <img
                                                    src={`http://localhost:8080/stanrey/producto/imagen/${prod.urlImagen}`}
                                                    alt={prod.nombre}
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                            ) : 'Sin imagen'}
                                        </td>
                                        <td>{prod.idProducto}</td>
                                        <td>{prod.nombre} / {prod.categoria?.descripcion || 'Sin categoría'}</td>
                                        <td>${prod.precio}</td>
                                        <td>{prod.stock}</td>
                                        <td>
                                            <button className='baja-button' onClick={(e) => handleStateChange(e, prod)}>Baja</button>
                                            <button className='modificar-button' onClick={() => {
                                                setProductoEditando(prod);
                                                setFormMode('-open');
                                            }}>Modificar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {productos.filter(p => p.estado === 0).length === 0 ? (
                        <p>No hay productos inactivos</p>
                    ) : (
                        <table className="table">
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
                                {productos.filter(p => p.estado === 0).map(prod => (
                                    <tr key={prod.idProducto}>
                                        <td>
                                            {prod.urlImagen ? (
                                                <img
                                                    src={`http://localhost:8080/stanrey/producto/imagen/${prod.urlImagen}`}
                                                    alt={prod.nombre}
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                            ) : 'Sin imagen'}
                                        </td>
                                        <td>{prod.idProducto}</td>
                                        <td>{prod.nombre} / {prod.categoria?.descripcion || 'Sin categoría'}</td>
                                        <td>${prod.precio}</td>
                                        <td>{prod.stock}</td>
                                        <td>
                                            <button className='alta-button' onClick={(e) => handleStateChange(e, prod)}>Alta</button>
                                            <button className='modificar-button' onClick={() => {
                                                setProductoEditando(prod);
                                                setFormMode('-open');
                                            }}>Modificar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <ProductoForm
                        formFunctions={[formMode, setFormMode, setProductos, fetchProductos]}
                        productoEditando={productoEditando}
                        setProductoEditando={setProductoEditando}
                    />
                </>
            )}

            {activeTab === 'facturas' && (
                <>
                    <h2>Facturas</h2>
                    {facturas.length === 0 ? (
                        <p>No hay facturas registradas</p>
                    ) : (
                        <table className="table">
                            <caption>Ventas Realizadas</caption>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facturas.map((factura) => (
                                    <tr key={factura.idFactura}>
                                        <td>{factura.idFactura}</td>
                                        <td>{factura.usuario?.persona?.nombre} {factura.usuario?.persona?.apellido}</td>
                                        <td>{new Date(factura.fecha).toLocaleString()}</td>
                                        <td>${factura.total}</td>
                                        <td><button className="ver-detalle-button">Ver Detalle</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
