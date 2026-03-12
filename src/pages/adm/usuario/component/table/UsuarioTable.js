import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const UsuarioTable = ({ usuarios, loading, onView, onEdit, onDelete, permisos }) => {

    const columns = [
        {
            title: 'Persona',
            dataIndex: 'descripcion',
            key: 'descripcion',
            sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
            render: (text, record) => (
                <Main.Space>
                    <Main.Avatar src={record.avatar} icon={<MainIcon.UserOutlined />} style={{ background: record.usuario_pg ? '#001529' : '#d9d9d9' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: '#262626' }}>
                            <MainIcon.IdcardOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                            {text}
                        </span>
                        <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.correo}</span>
                    </div>
                </Main.Space>
            ),
        },
        {
            title: 'Usuario PG',
            dataIndex: 'usuario_pg',
            key: 'usuario_pg',
            render: (text) => text ? <Main.Tag color="blue">{text}</Main.Tag> : <Main.Tag color="orange">Sin Acceso</Main.Tag>,
        },
        {
            title: 'Rol Principal',
            dataIndex: 'rol_principal',
            key: 'rol_principal',
            render: (text) => {
                if (!text) return '-';
                const roleConfig = {
                    rol_super_adm: { color: 'purple', text: 'Super Admin' },
                    rol_adm: { color: 'blue', text: 'Admin' },
                    rol_cliente: { color: 'green', text: 'Cliente Admin' },
                    rol_usuario: { color: 'orange', text: 'Usuario Admin' },
                    rol_consulta: { color: 'yellow', text: 'Consulta Admin' }
                };
                const config = roleConfig[text] || { color: 'default', text: text };
                return <Main.Tag color={config.color}>{config.text}</Main.Tag>;
            }
        },
        {
            title: 'Documento',
            dataIndex: 'nro_documento',
            key: 'nro_documento',
        },
        {
            title: 'Creado por',
            dataIndex: 'usuario_alta',
            key: 'usuario_alta',
            render: (text) => <span style={{ fontSize: '12px' }}>{text || '-'}</span>
        },
        {
            title: 'Modif. por',
            dataIndex: 'usuario_mod',
            key: 'usuario_mod',
            render: (text) => <span style={{ fontSize: '12px' }}>{text || '-'}</span>
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (estado) => (
                <Main.Tag color={estado === 'A' ? 'success' : 'error'}>
                    {estado === 'A' ? 'ACTIVO' : 'INACTIVO'}
                </Main.Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            align: 'center',
            render: (_, record) => (
                <Main.Space size="middle">
                    {record.usuario_pg ? (
                        <>
                            <Main.Tooltip title="Ver">
                                <Main.Button
                                    type="text"
                                    icon={<MainIcon.EyeOutlined />}
                                    onClick={() => onView(record)}
                                />
                            </Main.Tooltip>
                            <Main.Tooltip title="Editar">
                                <Main.Button
                                    type="text"
                                    icon={<MainIcon.EditOutlined />}
                                    onClick={() => onEdit(record)}
                                />
                            </Main.Tooltip>
                            <Main.Tooltip title="Quitar Acceso">
                                <Main.Button
                                    type="text"
                                    danger
                                    icon={<MainIcon.DeleteOutlined />}
                                    onClick={() => onDelete(record)}
                                />
                            </Main.Tooltip>
                        </>
                    ) : (
                        <Main.Button
                            type="primary"
                            size="small"
                            icon={<MainIcon.PlusOutlined />}
                            onClick={() => onEdit(record)}
                            style={{ background: '#001529' }}
                        >
                            Configurar
                        </Main.Button>
                    )}
                </Main.Space>
            ),
        },
    ];

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <Main.Table
                columns={columns}
                dataSource={usuarios}
                loading={loading}
                rowKey="cod_persona"
                pagination={false}
                className="custom-table"
            />
        </div>
    );
};

export default UsuarioTable;
