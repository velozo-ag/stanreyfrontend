import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

export const Carrito = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [carritoId, setCarritoId] = useState(null);
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCarrito = async () => {
            if (!isAuthenticated || !user?.idUsuario) {
                setError('Debes iniciar sesión para ver tu carrito');
                return;
            }

            try {
                const response = await api.get(`/carrito/usuario/${user.idUsuario}`);
                setCarritoId(response.data?.idCarrito);
                if (response.data?.idCarrito) {
                    const productosResponse = await api.get(`/carrito/productos/${response.data.idCarrito}`);
                    setProductos(productosResponse.data || []);
                }
            } catch (error) {
                console.error('Error al cargar carrito:', error);
                setError('Error al cargar carrito: ' + (error.response?.data?.message || error.message));
            }
        };

        fetchCarrito();
    }, [user?.idUsuario, isAuthenticated]);

    const handleModificarCantidad = async (idCarritoProducto, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;

        try {
            await api.put(`/carrito/producto/${idCarritoProducto}/cantidad/${nuevaCantidad}`);
            setProductos(prevProductos =>
                prevProductos.map(p =>
                    p.idCarritoProducto === idCarritoProducto ? { ...p, cantidad: nuevaCantidad } : p
                )
            );
        } catch (error) {
            console.error('Error al modificar cantidad:', error);
            setError('Error al modificar cantidad: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEliminarProducto = async (idCarritoProducto) => {
        try {
            await api.delete(`/carrito/eliminar-producto/${idCarritoProducto}`);
            setProductos(prevProductos => prevProductos.filter(p => p.idCarritoProducto !== idCarritoProducto));
            alert('Producto eliminado del carrito');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            setError('Error al eliminar producto: ' + (error.response?.data?.message || error.message));
        }
    };

    const calcularTotal = () => {
        return productos.reduce((acc, prod) => acc + prod.precioUnitario * prod.cantidad, 0);
    };

    const finalizarCompra = async () => {
        if (!carritoId || productos.length === 0) {
            setError('El carrito está vacío o no se ha cargado');
            return;
        }

        try {
            const facturaDTO = {
                fecha: new Date().toISOString(),
                importeTotal: calcularTotal(),
                formaPago: 'Tarjeta',
                estado: '1',
                usuarioId: user.idUsuario,
                carritoId: carritoId
            };

            const detallesDTO = productos.map(prod => ({
                idDetalleFactura: null,
                cantidad: prod.cantidad,
                subtotal: prod.precioUnitario * prod.cantidad,
                productoId: prod.producto.idProducto,
                facturaId: null
            }));

            await api.post('/factura/finalizar-compra', { facturaDTO, detallesDTO });
            setProductos([]);
            setCarritoId(null);
            alert('Compra finalizada con éxito');
        } catch (error) {
            console.error('Error al finalizar compra:', error);
            setError('Error al finalizar compra: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='carrito'>
            <h2>Mi Carrito</h2>
            {error && <p className="error-label">{error}</p>}
            {productos.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                <>
                    <div className='lista-productos'>
                        {productos.map((prod) => (
                            <div className='item-carrito' key={prod.idCarritoProducto}>
                                <img
                                    className='thumbnail'
                                    src={`http://localhost:8080/stanrey/producto/imagen/${prod.producto.urlImagen}`}
                                    alt={prod.producto.nombre}
                                />
                                <div className='info'>
                                    <h4>{prod.producto.nombre}</h4>
                                    <p>Precio: ${prod.precioUnitario}</p>
                                    <div className='cantidad'>
                                        <button
                                            onClick={() => handleModificarCantidad(prod.idCarritoProducto, prod.cantidad - 1)}
                                            disabled={prod.cantidad <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{prod.cantidad}</span>
                                        <button
                                            onClick={() => handleModificarCantidad(prod.idCarritoProducto, prod.cantidad + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p>Subtotal: ${prod.precioUnitario * prod.cantidad}</p>
                                    <button
                                        className='btn-eliminar'
                                        onClick={() => handleEliminarProducto(prod.idCarritoProducto)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='total'>
                        <strong>Total: ${calcularTotal()}</strong>
                        <br />
                        <button className='btn-finalizar' onClick={finalizarCompra}>
                            Finalizar compra
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};