import { useEffect, useContext, useState } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Producto } from '../models/Producto';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({ ...Producto });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'id_categoria') {

            setFormData((prev) => ({
                ...prev,
                id_categoria: { ...prev.id_categoria, id_categoria: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, url_imagen: URL.createObjectURL(file) }));
            setFormData((prev) => ({ ...prev, file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const productoData = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock),
                url_imagen: formData.url_imagen,
                color: formData.color,
                estado: formData.estado || 'ACTIVO',
                id_categoria: { id_categoria: formData.id_categoria.id_categoria },
            };

            const formDataToSend = new FormData();
            formDataToSend.append('producto', JSON.stringify(productoData));
            if (formData.file) {
                formDataToSend.append('imagen', formData.file);
            }

            const response = await api.post('/producto', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setProductos((prev) => [...prev, response.data]);
            setFormData({ ...Producto });
            console.log('Producto agregado:', response.data);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            setError('Error al agregar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admindashboard">
            <h2>Bienvenido, {user.persona.nombre} (Admin)</h2>
            <nav className="options">
                <ul>
                    <li>
                        <Link to="/admin/productos/agregar" className="button">
                            + Agregar Producto
                        </Link>
                    </li>
                </ul>
            </nav>
            <table className="table">
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
                    {productos.length === 0 ? (
                        <tr>
                            <td colSpan="6">No hay productos disponibles</td>
                        </tr>
                    ) : (
                        productos.map((prod) => (
                            <tr key={prod.idProducto}>
                                <td>
                                    {prod.urlImagen ? (
                                        <img
                                            src={prod.urlImagen}
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
                                <td>${prod.precio.toFixed(2)}</td>
                                <td>{prod.stock}</td>
                                <td>
                                    <button>Editar</button>
                                    <button>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="floating-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio</label>
                        <input
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Color</label>
                        <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Categoría</label>
                        <select
                            name="id_categoria"
                            value={formData.id_categoria.id_categoria}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map((cat) => (
                                <option key={cat.idCategoria} value={cat.idCategoria}>
                                    {cat.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Imagen</label>
                        <input type="file" name="imagen" onChange={handleFileChange} />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Agregar Producto'}
                    </button>
                </form>
                {error && <p className="error-label">{error}</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;