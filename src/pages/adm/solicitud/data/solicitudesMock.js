// Datos mock de solicitudes con auditoría completa
export const solicitudesMock = [
    {
        cod_solicitud: 1,
        nro_solicitud: 'SOL-2026-00001',
        cod_empresa: 1,
        nombre_empresa: 'ACME Corporation',
        descripcion: 'Carga de saldo mensual - Enero 2026',
        monto_solicitado: 50000000,
        estado: 'CONFIRMADA',
        observaciones: 'Carga mensual para personal administrativo y operativo',

        // Auditoría completa
        usuario_creacion: 'Juan Pérez',
        fecha_creacion: '2026-01-05 09:30:00',
        usuario_modificacion: 'Juan Pérez',
        fecha_modificacion: '2026-01-05 14:20:00',
        usuario_confirmacion: 'María González',
        fecha_confirmacion: '2026-01-06 10:15:00',

        cant_beneficiarios: 150
    },
    {
        cod_solicitud: 2,
        nro_solicitud: 'SOL-2026-00002',
        cod_empresa: 2,
        nombre_empresa: 'TechCorp S.A.',
        descripcion: 'Carga especial - Nuevos empleados Q1',
        monto_solicitado: 25000000,
        estado: 'PENDIENTE',
        observaciones: 'Incluye colaboradores del área de desarrollo',

        usuario_creacion: 'Carlos Ruiz',
        fecha_creacion: '2026-02-01 11:00:00',
        usuario_modificacion: null,
        fecha_modificacion: null,
        usuario_confirmacion: null,
        fecha_confirmacion: null,

        cant_beneficiarios: 75
    },
    {
        cod_solicitud: 3,
        nro_solicitud: 'SOL-2026-00003',
        cod_empresa: 1,
        nombre_empresa: 'ACME Corporation',
        descripcion: 'Carga adicional - Bono anual',
        monto_solicitado: 30000000,
        estado: 'BORRADOR',
        observaciones: 'Pendiente de validación de montos por RRHH',

        usuario_creacion: 'Ana Martínez',
        fecha_creacion: '2026-02-02 16:45:00',
        usuario_modificacion: null,
        fecha_modificacion: null,
        usuario_confirmacion: null,
        fecha_confirmacion: null,

        cant_beneficiarios: 0
    },
    {
        cod_solicitud: 4,
        nro_solicitud: 'SOL-2026-00004',
        cod_empresa: 3,
        nombre_empresa: 'Retail Express',
        descripcion: 'Carga de saldo - Febrero 2026',
        monto_solicitado: 45000000,
        estado: 'CONFIRMADA',
        observaciones: 'Operación normal mensual',

        usuario_creacion: 'Roberto Silva',
        fecha_creacion: '2026-02-01 08:00:00',
        usuario_modificacion: 'Roberto Silva',
        fecha_modificacion: '2026-02-01 09:30:00',
        usuario_confirmacion: 'María González',
        fecha_confirmacion: '2026-02-01 15:00:00',

        cant_beneficiarios: 200
    },
    {
        cod_solicitud: 5,
        nro_solicitud: 'SOL-2026-00005',
        cod_empresa: 2,
        nombre_empresa: 'TechCorp S.A.',
        descripcion: 'Ajuste de saldo - Corrección diciembre',
        monto_solicitado: 10000000,
        estado: 'RECHAZADA',
        observaciones: 'Rechazada por documentación incompleta',
        motivo_rechazo: 'Falta de documentación de respaldo. Solicitar nuevamente con comprobantes.',

        usuario_creacion: 'Luis Fernández',
        fecha_creacion: '2026-01-28 14:20:00',
        usuario_modificacion: null,
        fecha_modificacion: null,
        usuario_confirmacion: 'Supervisor Admin',
        fecha_confirmacion: '2026-01-29 10:00:00',

        cant_beneficiarios: 0
    }
];

// Estados con configuración de colores
export const estadosSolicitud = {
    B: {
        color: 'processing',
        text: 'Borrador',
        icon: 'EditOutlined',
        description: 'En proceso de elaboración'
    },
    P: {
        color: 'warning',
        text: 'Pendiente a Confirmar',
        icon: 'ClockCircleOutlined',
        description: 'Aguardando comprobante de pago'
    },
    C: {
        color: 'success',
        text: 'Confirmada / Vigente',
        icon: 'CheckCircleOutlined',
        description: 'Saldo habilitado correctamente'
    },
    R: {
        color: 'error',
        text: 'Rechazada',
        icon: 'CloseCircleOutlined',
        description: 'Rechazada por supervisor'
    },
    A: {
        color: 'default',
        text: 'Anulada',
        icon: 'StopOutlined',
        description: 'Cancelada por el usuario o empresa'
    }
};

// Función helper para formatear números a Guaraníes
export const formatCurrency = (value) => {
    if (value === null || value === undefined) return '₲ 0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '₲ 0';
    return `₲ ${num.toLocaleString('es-PY')}`;
};

// Función helper para formatear fechas
export const formatDate = (dateString) => {
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
