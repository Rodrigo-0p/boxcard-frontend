import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';
import IconSelector from '../../IconSelector';

const { Option } = Main.Select;

const MenusModalView = ({ visible, onCancel, onSave, loading, form, selectedMenu, menusList }) => {
    const parentMenus = menusList.filter(m => !m.cod_menu_padre && m.cod_menu !== selectedMenu?.cod_menu);

    return (
        <Main.Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MainIcon.EditOutlined style={{ color: '#1890ff' }} />
                    <span>{selectedMenu ? 'Editar Configuración de Menú' : 'Registrar Nuevo Menú'}</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            onOk={onSave}
            confirmLoading={loading}
            width={700}
            centered
            okText="Guardar Cambios"
            cancelText="Cancelar"
            maskClosable={false}
            className="custom-modal"
        >
            <div style={{ marginTop: '20px' }}>
                <Main.Form form={form} layout="vertical">
                    <Main.Row gutter={24}>
                        <Main.Col span={14}>
                            <Main.Form.Item
                                name="nombre_menu"
                                label="Etiqueta del Menú"
                                rules={[{ required: true, message: 'Falta el nombre' }]}
                            >
                                <Main.Input placeholder="Ej: Usuarios del Sistema" />
                            </Main.Form.Item>
                        </Main.Col>
                        <Main.Col span={10}>
                            <Main.Form.Item
                                name="icono"
                                label="Icono Visual"
                                rules={[{ required: true, message: 'Elija un icono' }]}
                            >
                                <IconSelector />
                            </Main.Form.Item>
                        </Main.Col>
                    </Main.Row>

                    <Main.Row gutter={24}>
                        <Main.Col span={24}>
                            <Main.Form.Item
                                name="ruta"
                                label="Ruta de Navegación (URL)"
                            >
                                <Main.Input placeholder="Ej: /conf/usuarios" prefix={<span style={{ color: '#bfbfbf' }}>/</span>} />
                            </Main.Form.Item>
                        </Main.Col>
                    </Main.Row>

                    <Main.Row gutter={24}>
                        <Main.Col span={14}>
                            <Main.Form.Item name="cod_menu_padre" label="Jerarquía (Menú Padre)">
                                <Main.Select placeholder="Convertir en Menú Principal" allowClear>
                                    {parentMenus.map(m => (
                                        <Option key={m.cod_menu} value={m.cod_menu}>{m.nombre_menu}</Option>
                                    ))}
                                </Main.Select>
                            </Main.Form.Item>
                        </Main.Col>
                        <Main.Col span={5}>
                            <Main.Form.Item name="orden" label="Orden">
                                <Main.InputNumber min={1} style={{ width: '100%' }} />
                            </Main.Form.Item>
                        </Main.Col>
                        <Main.Col span={5}>
                            <Main.Form.Item name="estado" label="Estado" rules={[{ required: true }]}>
                                <Main.Select>
                                    <Option value="A">Activo</Option>
                                    <Option value="I">Inactivo</Option>
                                </Main.Select>
                            </Main.Form.Item>
                        </Main.Col>
                    </Main.Row>

                    {selectedMenu && (
                        <div style={{
                            padding: '12px',
                            background: '#f6f8fa',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: '#8c8c8c',
                            marginTop: '10px'
                        }}>
                            <MainIcon.InfoCircleOutlined style={{ marginRight: 6 }} />
                            ID Interno de Menú: <b>{selectedMenu.cod_menu}</b> |
                            Ultima Modificación: <b>Sincronizada</b>
                        </div>
                    )}
                </Main.Form>
            </div>
        </Main.Modal>
    );
};

export default MenusModalView;
