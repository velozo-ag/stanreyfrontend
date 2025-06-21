import { useEffect, useState } from "react";
import api from "../api/api";
import { Producto } from "../models/Producto";
import '../styles/AdminDashboard.css';

export const ProductoForm = ({ formFunctions, productoEditando, setProductoEditando }) => {
    const [formMode, setFormMode, setProductos, fetchProductos] = formFunctions;
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({ ...Producto });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (productoEditando) {
            setFormData({
                id_producto: productoEditando.idProducto,
                nombre: productoEditando.nombre,
                descripcion: productoEditando.descripcion,
                precio: productoEditando.precio,
                stock: productoEditando.stock,
                url_imagen: productoEditando.urlImagen,
                color: productoEditando.color,
                estado: productoEditando.estado,
                id_categoria: {
                    id_categoria: productoEditando.categoria?.idCategoria || productoEditando.categoriaId || ''
                }
            });
        } else {
            setFormData({ ...Producto });
        }
    }, [productoEditando]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await api.get('/categoria/lista');
                setCategorias(response.data);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
                setError('Error al cargar categorías');
            }
        };
        fetchCategorias();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id_categoria') {
            setFormData(prev => ({
                ...prev,
                id_categoria: { id_categoria: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataImage = new FormData();
        formDataImage.append('file', file);

        try {
            const res = await api.post('/it_admin/producto/uploadImagen', formDataImage, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setFormData(prev => ({
                ...prev,
                url_imagen: res.data
            }));
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            setError('Error al subir la imagen');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const productoData = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock),
            urlImagen: formData.url_imagen,
            color: formData.color,
            estado: 1,
            categoriaId: formData.id_categoria.id_categoria
        };

        try {
            if (productoEditando) {
                await api.put(`/it_admin/producto/modificar/${formData.id_producto}`, productoData);
            } else {
                const response = await api.post('/it_admin/producto/save', productoData);
                setProductos(prev => [...prev, response.data]);
            }

            setFormData({ ...Producto });
            setProductoEditando(null);
            setFormMode('');
            fetchProductos();
        } catch (error) {
            console.error('Error al guardar producto:', error);
            setError('Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    const cancelarFormulario = () => {
        setFormMode('');
        setProductoEditando(null);
        setFormData({ ...Producto });
    };

    return (
        <div className={"floating-form" + formMode}>
            <h2>{productoEditando ? 'Modificar Producto' : 'Agregar Producto'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Precio</label>
                    <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Color</label>
                    <input type="text" name="color" value={formData.color} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Categoría</label>
                    <select name="id_categoria" value={formData.id_categoria.id_categoria} onChange={handleInputChange} required>
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
                    {formData.url_imagen && (
                        <p><small>Imagen actual: <em>{formData.url_imagen}</em></small></p>
                    )}
                </div>
                <button type="button" onClick={cancelarFormulario}>Cancelar</button>
                <button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : productoEditando ? 'Modificar Producto' : 'Agregar Producto'}
                </button>
            </form>
            {error && <p className="error-label">{error}</p>}
        </div>
    );
};
