import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import { formatCurrency, formatDate, estadosSolicitud } from '../../data/solicitudesMock';

const SolicitudTableView = ({
    solicitudes,
    loading,
    onView,
    onEdit,
    onDelete
}) => {

    const getEstadoConfig = (estado) => {
        return estadosSolicitud[estado] || {
            color: 'default',
            text: estado,
            icon: 'QuestionOutlined'
        };
    };

    const columns = [
        {
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 50,
            align: 'center',
            render: (_, record) => {
                const initials = Main.generateAbbreviation(record.nombre_empresa);
                return (
                    <Main.Avatar size={32} className="card-avatar-table">
                        {initials}
                    </Main.Avatar>
                );
            },
        },
        {
            title: 'Nro. Solicitud',
            dataIndex: 'nro_solicitud',
            key: 'nro_solicitud',
            width: 140,
            sorter: (a, b) => a.nro_solicitud.localeCompare(b.nro_solicitud),
            render: (nro) => (
                <span style={{ fontWeight: 500, color: '#1890ff' }}>{nro}</span>
            ),
        },
        {
            title: 'Empresa',
            dataIndex: 'nombre_empresa',
            key: 'nombre_empresa',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            ellipsis: true,
            render: (text) => (
                <span className="table-nombre">{text}</span>
            ),
        },
        {
            title: 'Beneficiarios',
            dataIndex: 'cant_beneficiarios',
            key: 'cant_beneficiarios',
            width: 110,
            align: 'center',
            render: (cant) => (
                <Main.Badge
                    count={cant}
                    showZero
                    style={{ backgroundColor: '#52c41a' }}
                />
            ),
        },
        {
            title: 'Monto Solicitado',
            dataIndex: 'monto_solicitado',
            key: 'monto_solicitado',
            width: 150,
            align: 'right',
            sorter: (a, b) => a.monto_solicitado - b.monto_solicitado,
            render: (monto) => (
                <span style={{ fontWeight: 600, color: '#389e0d' }}>
                    {formatCurrency(monto)}
                </span>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            width: 130,
            align: 'center',
            filters: [
                { text: 'Borrador', value: 'BORRADOR' },
                { text: 'Pendiente', value: 'PENDIENTE' },
                { text: 'Confirmada', value: 'CONFIRMADA' },
                { text: 'Rechazada', value: 'RECHAZADA' },
            ],
            onFilter: (value, record) => record.estado === value,
            render: (estado) => {
                const config = getEstadoConfig(estado);
                const Icon = MainIcon[config.icon];
                return (
                    <Main.Tag
                        icon={<Icon />}
                        color={config.color}
                        className="table-tag-estado"
                    >
                        {config.text}
                    </Main.Tag>
                );
            },
        },
        {
            title: 'Fecha Creación',
            dataIndex: 'fecha_creacion',
            key: 'fecha_creacion',
            width: 150,
            sorter: (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion),
            render: (fecha) => (
                <span style={{ fontSize: '12px' }}>{formatDate(fecha)}</span>
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 110,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Main.Space size="small">
                    <Main.Tooltip title="Ver detalle">
                        <Main.Button
                            type="text"
                            size="small"
                            icon={<MainIcon.EyeOutlined />}
                            onClick={() => onView(record)}
                            className="btn-action btn-view"
                        />
                    </Main.Tooltip>
                    {record.estado === 'BORRADOR' && (
                        <>
                            <Main.Tooltip title="Editar">
                                <Main.Button
                                    type="text"
                                    size="small"
                                    icon={<MainIcon.EditOutlined />}
                                    onClick={() => onEdit(record)}
                                    className="btn-action btn-edit"
                                />
                            </Main.Tooltip>
                            <Main.Tooltip title="Eliminar">
                                <Main.Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<MainIcon.DeleteOutlined />}
                                    onClick={() => onDelete(record)}
                                    className="btn-action btn-delete"
                                />
                            </Main.Tooltip>
                        </>
                    )}
                    {record.estado === 'PENDIENTE' && (
                        <Main.Tooltip title="Anular Solicitud">
                            <Main.Button
                                type="text"
                                size="small"
                                danger
                                icon={<MainIcon.StopOutlined />}
                                onClick={() => onDelete(record)}
                                className="btn-action btn-delete"
                            />
                        </Main.Tooltip>
                    )}
                </Main.Space>
            ),
        },
    ];

    return (
        <div className="solicitud-table-container">
            <Main.Table
                className="solicitud-table"
                columns={columns}
                dataSource={solicitudes}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total} solicitudes`,
                }}
                rowKey="cod_solicitud"
                size="middle"
                scroll={{ x: 1400 }}
                bordered
            />
        </div>
    );
};

export default SolicitudTableView;
