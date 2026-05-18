import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';

const EspecialTable = ({ data, loading, onEdit, assignedPerms, permisos }) => {
    
    // Contar cuántos permisos especiales tiene cada usuario
    const getPermCount = (usuario_pg) => {
        return assignedPerms.filter(p => p.usuario_pg === usuario_pg).length;
    };

    const columns = [
        {
            title: 'Usuario',
            dataIndex: 'usuario_pg',
            key: 'usuario_pg',
            width: 150,
            render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
        },
        {
            title: 'Nombre Completo',
            dataIndex: 'descripcion',
            key: 'descripcion',
            render: (text) => text || '-'
        },
        {
            title: 'Rol Principal',
            dataIndex: 'rol_principal',
            key: 'rol_principal',
            render: (text) => text ? <Main.Tag color="blue">{text}</Main.Tag> : '-'
        },
        {
            title: 'Documento',
            dataIndex: 'nro_documento',
            key: 'nro_documento',
        },
        {
            title: 'Excepciones',
            key: 'excepciones',
            align: 'center',
            width: 120,
            render: (_, record) => {
                const count = getPermCount(record.usuario_pg);
                return count > 0 ? (
                    <Main.Badge count={count} style={{ backgroundColor: '#52c41a' }} overflowCount={99}>
                        <Main.Tag color="green" bordered={false} style={{ marginRight: 0 }}>Activas</Main.Tag>
                    </Main.Badge>
                ) : (
                    <Main.Tag color="default" bordered={false}>Ninguna</Main.Tag>
                );
            }
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Main.Tooltip title="Gestionar Permisos Especiales">
                    <Main.Button 
                        type="primary" 
                        ghost
                        icon={<MainIcon.EditOutlined />} 
                        onClick={() => onEdit(record)}
                        size="small"
                        disabled={!permisos?.update}
                    />
                </Main.Tooltip>
            )
        }
    ];

    return (
        <Main.Table 
            dataSource={data} 
            columns={columns} 
            rowKey="cod_persona"
            loading={loading}
            size="middle"
            pagination={false} // Se maneja externamente
            className="custom-table"
        />
    );
};

export default EspecialTable;
