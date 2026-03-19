// Función helper para formatear números a Guaraníes
export const formatCurrency = (value) => {
    if (!value && value !== 0) return '₲ 0';
    return `₲ ${Number(value).toLocaleString('es-PY')}`;
};

// Función helper para formatear fechas
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Función para calcular estadísticas
export const calcularEstadisticas = (beneficiarios) => {
    const activos = beneficiarios.filter(b => b.estado === 'A');
    const pendientes = beneficiarios.filter(b => b.estado === 'P');

    return {
        total: beneficiarios.length,
        activos: activos.length,
        inactivos: beneficiarios.filter(b => b.estado === 'I').length,
        pendientes: pendientes.length,
        saldoTotal: activos.reduce((sum, b) => sum + (Number(b.saldo_disponible) || 0), 0),
        saldoBloqueado: activos.reduce((sum, b) => sum + (Number(b.saldo_bloqueado) || 0), 0),
        promedioSaldo: activos.length > 0
            ? activos.reduce((sum, b) => sum + (Number(b.saldo_disponible) || 0), 0) / activos.length
            : 0
    };
};
