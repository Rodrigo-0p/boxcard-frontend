import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';

const { Option } = Main.Select;

const EspecialModalView = ({ visible, onCancel, onSave, onRevoke, loading, form, selectedUser, assignedPerms, menus, roles }) => {
    return (
        <Main.Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        background: '#e6f7ff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#1890ff'
                    }}>
                        <MainIcon.UserOutlined />
                    </div>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }}>{selectedUser ? 'Personalización de Navegación' : 'Nueva Estructura de Navegación'}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 400 }}>
                            {selectedUser ? `${selectedUser.descripcion} (${selectedUser.usuario_pg})` : 'Defina accesos adicionales para la navegación del usuario'}
                        </div>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={[
                <Main.Button key="close" onClick={onCancel}>Cerrar</Main.Button>
            ]}
            width={700}
            centered
            maskClosable={false}
        >
            <div style={{ marginTop: '20px' }}>
                
                {/* SECCIÓN 0: SELECCIÓN DE USUARIO (Solo si no viene de la tabla) */}
                {!selectedUser && (
                    <div className="modal-section" style={{ marginBottom: '20px' }}>
                        <Main.Form form={form} layout="vertical">
                            <Main.Form.Item 
                                name="usuario_pg" 
                                label="Seleccionar Usuario" 
                                rules={[{ required: true, message: 'Seleccione un usuario' }]}
                            >
                                <Main.Select 
                                    showSearch 
                                    placeholder="Buscar por nombre o ID..."
                                    optionFilterProp="children"
                                    onChange={(val) => {
                                        // Aquí opcionalmente podríamos cargar perms si cambia
                                    }}
                                >
                                    {/* Nota: Necesitaríamos la lista de users aquí si permitimos crear desde cero */}
                                    {/* Por ahora, asumimos que el usuario usará la tabla para gestionar */}
                                </Main.Select>
                            </Main.Form.Item>
                        </Main.Form>
                    </div>
                )}

                {/* SECCIÓN 1: PERMISOS ACTUALES */}
                {selectedUser && (
                    <div className="modal-section" style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MainIcon.SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                        <span style={{ fontWeight: 600 }}>Permisos Especiales Activos</span>
                    </div>
                    
                    {assignedPerms.length === 0 ? (
                        <Main.Empty 
                            description="Este usuario no tiene permisos especiales asignados" 
                            image={Main.Empty.PRESENTED_IMAGE_SIMPLE} 
                        />
                    ) : (
                        <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                            <Main.List
                                size="small"
                                dataSource={assignedPerms}
                                renderItem={(item) => (
                                    <Main.List.Item
                                        actions={[
                                            <Main.Tooltip title="Revocar Permiso">
                                                <Main.Button 
                                                    type="text" 
                                                    danger 
                                                    icon={<MainIcon.DeleteOutlined />} 
                                                    onClick={() => onRevoke(item)}
                                                />
                                            </Main.Tooltip>
                                        ]}
                                    >
                                        <Main.List.Item.Meta
                                            avatar={<MainIcon.StarFilled style={{ color: '#faad14' }} />}
                                            title={<span style={{ fontWeight: 500 }}>{item.nombre_menu}</span>}
                                            description={<Main.Tag color="blue">{item.cod_role}</Main.Tag>}
                                        />
                                    </Main.List.Item>
                                )}
                            />
                        </div>
                    )}
                </div>
                )}

                <Main.Divider />

                {/* SECCIÓN 2: AGREGAR NUEVO */}
                <div className="modal-section">
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MainIcon.PlusCircleOutlined style={{ color: '#1890ff' }} />
                        <span style={{ fontWeight: 600 }}>Agregar Nueva Excepción</span>
                    </div>

                    <Main.Form form={form} layout="vertical">
                        <Main.Row gutter={12}>
                            <Main.Col span={10}>
                                <Main.Form.Item 
                                    name="cod_role" 
                                    label="Rol Asociado" 
                                    rules={[{ required: true, message: 'Elija rol' }]}
                                >
                                    <Main.Select placeholder="Seleccionar rol..." allowClear>
                                        {(roles || []).map(r => (
                                            <Option key={r.cod_role} value={r.cod_role}>{r.nombre_role}</Option>
                                        ))}
                                    </Main.Select>
                                </Main.Form.Item>
                            </Main.Col>
                            <Main.Col span={10}>
                                <Main.Form.Item 
                                    name="cod_menu" 
                                    label="Menú a Habilitar" 
                                    rules={[{ required: true, message: 'Elija menú' }]}
                                >
                                    <Main.Select 
                                        showSearch 
                                        placeholder="Seleccionar menú..."
                                        optionFilterProp="children"
                                        allowClear
                                    >
                                        {(menus || []).map(m => (
                                            <Option key={m.cod_menu} value={m.cod_menu}>{m.nombre_menu}</Option>
                                        ))}
                                    </Main.Select>
                                </Main.Form.Item>
                            </Main.Col>
                            <Main.Col span={4} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '24px' }}>
                                <Main.Button 
                                    type="primary" 
                                    icon={<MainIcon.PlusOutlined />} 
                                    onClick={onSave}
                                    loading={loading}
                                    block
                                >
                                    Añadir
                                </Main.Button>
                            </Main.Col>
                        </Main.Row>

                        <Main.Form.Item name="usuario_pg" hidden><Main.Input /></Main.Form.Item>
                        <Main.Form.Item name="cod_empresa" hidden><Main.Input /></Main.Form.Item>
                    </Main.Form>
                </div>

                <div style={{ 
                    marginTop: '16px',
                    padding: '12px', 
                    background: '#fffbe6', 
                    border: '1px solid #ffe58f', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: '#856404'
                }}>
                    <MainIcon.InfoCircleOutlined style={{ marginRight: 8 }} />
                    Nota: Estas configuraciones definen la estructura de navegación personalizada para el usuario, permitiendo accesos más allá de su rol principal.
                </div>
            </div>
        </Main.Modal>
    );
};

export default EspecialModalView;
