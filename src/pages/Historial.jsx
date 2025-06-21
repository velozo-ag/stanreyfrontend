import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

export const Historial = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [facturas, setFacturas] = useState([]);
    const [detalles, setDetalles] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFacturas = async () => {
            if (!isAuthenticated || !user?.idUsuario) {
                setError('Debes iniciar sesión para ver tu historial');
                return;
            }

            try {
                const response = await api.get(`/factura/usuario/${user.idUsuario}`);
                setFacturas(response.data || []);
            } catch (error) {
                console.error('Error al cargar facturas:', error);
                setError('Error al cargar facturas: ' + (error.response?.data?.message || error.message));
            }
        };

        fetchFacturas();
    }, [user?.idUsuario, isAuthenticated]);

    const handleVerDetalles = async (idFactura) => {
        try {
            const response = await api.get(`/factura/detalles/${idFactura}`);
            setDetalles(prev => ({
                ...prev,
                [idFactura]: response.data || []
            }));
        } catch (error) {
            console.error('Error al cargar detalles:', error);
            setError('Error al cargar detalles: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='historial'>
            <h2>Historial de Compras</h2>
            {error && <p className="error-label">{error}</p>}
            {facturas.length === 0 ? (
                <p>No hay compras registradas.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Forma de Pago</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.map((factura) => (
                            <tr key={factura.idFactura}>
                                <td>{factura.idFactura}</td>
                                <td>{new Date(factura.fecha).toLocaleString()}</td>
                                <td>${factura.importeTotal}</td>
                                <td>{factura.formaPago}</td>
                                <td>
                                    <button
                                        className="ver-detalle-button"
                                        onClick={() => handleVerDetalles(factura.idFactura)}
                                    >
                                        Ver Detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {Object.keys(detalles).map((idFactura) => (
                detalles[idFactura].length > 0 && (
                    <div key={idFactura} className="detalle-factura">
                        <h3>Detalles de Factura #{idFactura}</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles[idFactura].map((detalle) => (
                                    <tr key={detalle.idDetalleFactura}>
                                        <td>{detalle.producto?.nombre}</td>
                                        <td>{detalle.cantidad}</td>
                                        <td>${detalle.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ))}
        </div>
    );
};