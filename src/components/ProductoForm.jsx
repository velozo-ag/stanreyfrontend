import { useEffect, useState } from "react";
import api from "../api/api";
import { Producto } from "../models/Producto";
import '../styles/AdminDashboard.css';

export const ProductoForm = ({ formFunctions }) => {
    const [formMode, setFormMode, setProductos, fetchProductos] = formFunctions;
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({ ...Producto });

    const [loading, setLoading] = useState(false);
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formDataImage = new FormData();
            formDataImage.append('file', file);

            try {
                const response = await api.post('/it_admin/producto/uploadImagen', formDataImage, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const uploadedFileName = response.data;
                setFormData((prev) => ({
                    ...prev,
                    url_imagen: uploadedFileName,
                }));

                console.log('Imagen subida:', uploadedFileName);
            } catch (error) {
                console.error('Error subiendo imagen:', error);
                setError('Error al subir la imagen');
            }
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
                urlImagen: formData.url_imagen,
                color: formData.color,
                estado: 1,
                categoriaId: formData.id_categoria.id_categoria,
            };

            const response = await api.post('/it_admin/producto/save', productoData);

            setProductos((prev) => [...prev, response.data]);
            setFormData({ ...Producto });
            setFormMode('');
            fetchProductos();
            console.log('Producto agregado:', response.data);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            setError('Error al agregar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"floating-form" + formMode}>
            <h2>Agregar Producto</h2>
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
                        required
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
                        value={formData.id_categoria.idCategoria}
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
                    <input type="file" name="imagen" onChange={handleFileChange} required />
                </div>
                <button onClick={(e) => {
                    e.preventDefault();
                    setFormMode('')
                }}>Cancelar</button>
                <button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Agregar Producto'}
                </button>
            </form>
            {error && <p className="error-label">{error}</p>}
        </div>
    );
}