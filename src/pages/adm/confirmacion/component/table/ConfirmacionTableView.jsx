import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import { formatCurrency, formatDate, estadosSolicitud } from '../../../solicitud/data/solicitudesMock';

const ConfirmacionTableView = ({
    solicitudes,
    loading,
    onView,
    onConfirm
}) => {

    const columns = [
        {
            title: 'Nro. Solicitud',
            dataIndex: 'nro_solicitud',
            key: 'nro_solicitud',
            width: 140,
            render: (nro) => <span style={{ fontWeight: 610, color: '#2a4b75' }}>SOL-{nro}</span>,
        },
        {
            title: 'Empresa / Solicitante',
            key: 'empresa_info',
            width: 200,
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{record.nombre_empresa}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Solicitado por: <b>{record.solicitante_nombre || record.solicitante_username}</b>
                    </span>
                </div>
            )
        },
        {
            title: 'Empresa Destino',
            key: 'empresa_destino',
            width: 180,
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, color: '#0369a1' }}>{record.nombre_empresa_destino || 'No asignada'}</span>
                    {record.cod_empresa_destino && (
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>ID: {record.cod_empresa_destino}</span>
                    )}
                </div>
            )
        },
        {
            title: 'Monto Total',
            dataIndex: 'monto_solicitado',
            key: 'monto_solicitado',
            width: 150,
            align: 'right',
            render: (monto) => <span style={{ fontWeight: 700, color: '#059669', fontSize: '15px' }}>{formatCurrency(monto)}</span>,
        },
        {
            title: 'Cant. Benef.',
            dataIndex: 'cant_beneficiarios',
            key: 'cant_beneficiarios',
            width: 100,
            align: 'center',
            render: (cant) => <Main.Tag color="blue">{cant} Empleados</Main.Tag>
        },
        {
            title: 'Fecha Solicitud',
            dataIndex: 'fecha_creacion',
            key: 'fecha_creacion',
            width: 150,
            render: (fecha) => <span>{formatDate(fecha)}</span>
        },
        {
            title: 'Acciones de Confirmación',
            key: 'acciones',
            width: 180,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Main.Space size="middle">
                    <Main.Button
                        type="primary"
                        size="small"
                        icon={<MainIcon.CheckCircleOutlined />}
                        style={{ background: '#059669', borderColor: '#059669' }}
                        onClick={() => onConfirm(record)}
                    >
                        Confirmar Carga
                    </Main.Button>
                </Main.Space>
            ),
        },
    ];

    return (
        <div className="confirmacion-table-container">
            <Main.Table
                columns={columns}
                dataSource={solicitudes}
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowKey="cod_solicitud"
                size="middle"
                bordered
                className="confirm-custom-table"
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

export default ConfirmacionTableView;
