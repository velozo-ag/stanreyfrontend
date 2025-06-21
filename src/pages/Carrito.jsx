import { useState, useEffect } from 'react';

export const Carrito = () => {
    const [productos, setProductos] = useState({
        '1': {
            idProducto: '1',
            nombre: 'Termi',
            precio: 3500,
            urlImagen: 'termo.jpg',
            cantidad: 2
        },
        '2': {
            idProducto: '2',
            nombre: 'mate',
            precio: 7200,
            urlImagen: 'mate.jpg',
            cantidad: 1
        }
    });

    const incrementarCantidad = (id) => {
        setProductos((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                cantidad: prev[id].cantidad + 1
            }
        }));
    };

    const decrementarCantidad = (id) => {
        setProductos((prev) => {
            if (prev[id].cantidad === 1) return prev;
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    cantidad: prev[id].cantidad - 1
                }
            };
        });
    };

    const eliminarProducto = (id) => {
        setProductos((prev) => {
            const nuevo = { ...prev };
            delete nuevo[id];
            return nuevo;
        });
    };

    const calcularTotal = () => {
        return Object.values(productos).reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    };

    const finalizarCompra = () => {
        alert('Compra finalizada');
        setProductos({});
    };

    return (
        <div className='carrito'>
            <h2>Mi Carrito</h2>
            {Object.keys(productos).length === 0 ? (
                <p>No hay productos en el carrito.</p>
            ) : (
                <>
                    <div className='lista-productos'>
                        {Object.values(productos).map((prod) => (
                            <div className='item-carrito' key={prod.idProducto}>
                                <img
                                    src={`http://localhost:8080/stanrey/producto/imagen/${prod.urlImagen}`}
                                    alt={prod.nombre}
                                    className='thumbnail'
                                />
                                <div className='info'>
                                    <h4>{prod.nombre}</h4>
                                    <p>Precio: ${prod.precio}</p>
                                    <div className='cantidad'>
                                        <button onClick={() => decrementarCantidad(prod.idProducto)}>-</button>
                                        <span>{prod.cantidad}</span>
                                        <button onClick={() => incrementarCantidad(prod.idProducto)}>+</button>
                                    </div>
                                    <p>Subtotal: ${prod.precio * prod.cantidad}</p>
                                    <button className='btn-eliminar' onClick={() => eliminarProducto(prod.idProducto)}>Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='total'>
                        <strong>Total: ${calcularTotal()}</strong>
                        <br />
                        <button className='btn-finalizar' onClick={finalizarCompra}>Finalizar compra</button>
                    </div>
                </>
            )}
        </div>
    );
};
