import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const SolicitudesTable = ({
    solicitudes,
    loading,
    onView,
    onEdit,
    onDelete,
    onApprove,
    permisos
}) => {

    const columns = [
        {
            title: 'Nro. Solicitud',
            dataIndex: 'nro_solicitud',
            key: 'nro_solicitud',
            width: 120,
            render: (text) => <span style={{ fontWeight: 600, color: '#1890ff' }}>SOL-{text}</span>
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha_creacion',
            key: 'fecha_creacion',
            width: 120,
            render: (date) => Main.formatDate(date)
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            ellipsis: true,
        },
        {
            title: 'Cant. Beneficiarios',
            dataIndex: 'cant_beneficiarios',
            key: 'cant_beneficiarios',
            width: 150,
            align: 'center',
            render: (count) => <Main.Tag color="blue">{count}</Main.Tag>
        },
        {
            title: 'Monto Total',
            dataIndex: 'monto_solicitado',
            key: 'monto_solicitado',
            width: 150,
            align: 'right',
            render: (monto) => <span style={{ fontWeight: 600, color: '#389e0d' }}>{Main.formatCurrency(monto)}</span>
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            width: 130,
            align: 'center',
            render: (estado) => {
                const config = Main.estadosSolicitud[estado] || { color: 'default', text: estado };
                const Icon = MainIcon[config.icon];
                return (
                    <Main.Tag icon={Icon && <Icon />} color={config.color}>
                        {config.text}
                    </Main.Tag>
                );
            }
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 140,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Main.Space size="middle">
                    <Main.Tooltip title="Ver Detalle">
                        <Main.Button
                            type="text"
                            icon={<MainIcon.EyeOutlined />}
                            onClick={() => onView(record)}
                        />
                    </Main.Tooltip>

                    {record.estado === 'B' && (
                        <Main.Tooltip title="Editar">
                            <Main.Button
                                type="text"
                                icon={<MainIcon.EditOutlined style={{ color: '#faad14' }} />}
                                onClick={() => onEdit(record)}
                                disabled={!permisos?.update}
                            />
                        </Main.Tooltip>
                    )}

                    {record.estado === 'P' && (
                        <Main.Tooltip title="Aprobar">
                            <Main.Button
                                type="text"
                                icon={<MainIcon.CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                onClick={() => onApprove(record)}
                                disabled={!permisos?.update}
                            />
                        </Main.Tooltip>
                    )}

                    {record.estado === 'B' && (
                        <Main.Tooltip title="Eliminar">
                            <Main.Button
                                type="text"
                                icon={<MainIcon.DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={() => onDelete(record)}
                                disabled={!permisos?.delete}
                            />
                        </Main.Tooltip>
                    )}
                </Main.Space>
            )
        }
    ];

    return (
        <Main.Table
            columns={columns}
            dataSource={solicitudes}
            loading={loading}
            rowKey="cod_solicitud"
            pagination={false}
            size="small"
            scroll={{ x: 1000 }}
            className="main-table"
        />
    );
};

export default SolicitudesTable;
