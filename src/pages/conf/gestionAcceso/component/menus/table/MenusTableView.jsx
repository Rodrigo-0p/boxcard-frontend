import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';

const MenusTableView = React.memo(({ data, loading, onEdit, onDelete, permisos }) => {
    
    const columns = [
        {
            title: 'ID',
            dataIndex: 'cod_menu',
            key: 'cod_menu',
            width: 80,
            align: 'center',
            sorter: (a, b) => a.cod_menu - b.cod_menu
        },
        {
            title: 'Nombre del Menú',
            dataIndex: 'nombre_menu',
            key: 'nombre_menu',
            render: (text, record) => (
                <span style={{ 
                    fontWeight: record.cod_menu_padre ? 400 : 700,
                    color: record.cod_menu_padre ? '#595959' : '#001529',
                    fontSize: record.cod_menu_padre ? '13px' : '14px'
                }}>
                    {text}
                </span>
            )
        },
        {
            title: 'Icono',
            dataIndex: 'icono',
            key: 'icono',
            width: 150,
            render: (icon) => {
                const IconComp = MainIcon[icon] || MainIcon.QuestionOutlined;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                            width: '28px', 
                            height: '28px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: '#f5f5f5',
                            borderRadius: '4px'
                        }}>
                            {IconComp ? <IconComp style={{ fontSize: '16px', color: '#595959' }} /> : null}
                        </div>
                        <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{icon}</span>
                    </div>
                );
            }
        },
        {
            title: 'Ruta / URL',
            dataIndex: 'ruta',
            key: 'ruta',
            render: (text) => <code style={{ fontSize: '11px', background: '#f6f8fa', padding: '2px 4px', borderRadius: '3px' }}>{text || '-'}</code>
        },
        {
            title: 'Orden',
            dataIndex: 'orden',
            key: 'orden',
            width: 80,
            align: 'center',
            sorter: (a, b) => a.orden - b.orden
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            width: 100,
            render: (estado) => (
                <Main.Tag color={estado === 'A' ? 'success' : 'default'} bordered={false}>
                    {estado === 'A' ? 'ACTIVO' : 'INACTIVO'}
                </Main.Tag>
            )
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Main.Space size="middle">
                    <Main.Tooltip title="Editar Menú">
                        <Main.Button 
                            type="text" 
                            icon={<MainIcon.EditOutlined />} 
                            onClick={() => onEdit(record)}
                            className="btn-edit"
                            disabled={!permisos?.update}
                        />
                    </Main.Tooltip>
                    <Main.Tooltip title="Eliminar Menú">
                        <Main.Button 
                            type="text" 
                            icon={<MainIcon.DeleteOutlined />} 
                            onClick={() => onDelete && onDelete(record)}
                            danger
                            disabled={!permisos?.delete}
                        />
                    </Main.Tooltip>
                </Main.Space>
            )
        }
    ];

    return (
        <Main.Table 
            dataSource={data} 
            columns={columns} 
            rowKey="cod_menu"
            loading={loading}
            pagination={false}
            size="small"
            className="custom-table menu-tree-table"
            rowClassName={(record) => record.children ? 'parent-menu-row' : 'child-menu-row'}
            expandable={{
                expandIcon: ({ expanded, onExpand, record }) => {
                    if (!record.children || record.children.length === 0) {
                        return <span style={{ marginLeft: '24px' }}></span>;
                    }
                    return (
                        <div 
                            onClick={e => onExpand(record, e)}
                            style={{ 
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                background: expanded ? '#e6f7ff' : '#f5f5f5',
                                transition: 'all 0.3s',
                                marginRight: '8px',
                                border: `1px solid ${expanded ? '#91d5ff' : '#d9d9d9'}`
                            }}
                            className="expand-icon-container"
                        >
                            {expanded ? (
                                <MainIcon.FolderOpenFilled style={{ fontSize: '14px', color: '#1890ff' }} />
                            ) : (
                                <MainIcon.FolderFilled style={{ fontSize: '14px', color: '#8c8c8c' }} />
                            )}
                        </div>
                    );
                },
                indentSize: 20,
                expandIconColumnIndex: 1, // Ponerlo en la columna de nombre
            }}
        />
    );
});

export default MenusTableView;
