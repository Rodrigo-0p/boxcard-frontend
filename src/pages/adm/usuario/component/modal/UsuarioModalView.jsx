import * as React from 'react';
import MainIcon from '../../../../../util/mainIcon';
import Main from '../../../../../util/main';
import { useAuth } from '../../../../../context/AuthContext';
import PasswordField from '../../../persona/component/modal/Passwordfield';
import { getPasswordStrengthLevel } from '../../../../../util/passwordgenerator';

const { Option } = Main.Select;

const UsuarioModalView = ({
    visible, mode, persona, loading, onClose, onSubmit, permisos,
    rolesDisp = [], loadingData,
    menusDisponibles = {}, loadingMenus = false, onLoadMenusForRole,
    menusActivos = {}, loadingMenusActivos = false,
    personasSinAcceso = [], loadingPersonas = false
}) => {

    const { empresa } = useAuth();
    const [form] = Main.Form.useForm();
    const message = Main.useMessage();

    const [rolPrincipal, setRolPrincipal] = React.useState(null);
    const [rolesAdicionales, setRolesAdicionales] = React.useState([]);
    const [menusSeleccionados, setMenusSeleccionados] = React.useState({});
    const [passwordTemporal, setPasswordTemporal] = React.useState('');
    const [esPasswordTemporal, setEsPasswordTemporal] = React.useState(true);
    const [menusActivosLoaded, setMenusActivosLoaded] = React.useState(false);

    // Roles adicionales modal
    const [modalRolesVisible, setModalRolesVisible] = React.useState(false);

    React.useEffect(() => {
        if (!visible) {
            form.resetFields();
            setRolPrincipal(null);
            setRolesAdicionales([]);
            setMenusSeleccionados({});
            setPasswordTemporal('');
            setMenusActivosLoaded(false);
        } else {
            if (mode !== 'create' && persona) {
                form.setFieldsValue({
                    cod_persona: persona.cod_persona,
                    usuario_pg: persona.usuario_pg,
                    rol_principal: persona.rol_principal,
                });
                setRolPrincipal(persona.rol_principal);
            } else {
                form.setFieldsValue({
                    cod_persona: persona?.cod_persona
                });
            }
        }
    }, [visible, mode, persona]);

    // Cargar menús activos en EDIT/VIEW
    React.useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && Object.keys(menusActivos).length > 0 && !loadingMenusActivos && !menusActivosLoaded && persona?.rol_principal) {
            const rolPrincipalReal = persona.rol_principal;
            setMenusSeleccionados(menusActivos);
            const todosLosRoles = Object.keys(menusActivos);
            const adicionales = todosLosRoles.filter(rol => rol !== rolPrincipalReal);
            setRolesAdicionales(adicionales);

            if (onLoadMenusForRole && !menusDisponibles[rolPrincipalReal]) {
                onLoadMenusForRole(rolPrincipalReal);
            }
            adicionales.forEach(rol => {
                if (onLoadMenusForRole && !menusDisponibles[rol]) {
                    onLoadMenusForRole(rol);
                }
            });
            setMenusActivosLoaded(true);
        }
    }, [menusActivos, loadingMenusActivos, mode, persona, onLoadMenusForRole]);

    // Cargar menús del rol principal cuando cambia
    React.useEffect(() => {
        if (rolPrincipal && onLoadMenusForRole) {
            onLoadMenusForRole(rolPrincipal);
        }
    }, [rolPrincipal, onLoadMenusForRole]);

    // Efecto para auto-seleccionar menús cuando se cargan por primera vez para un rol
    React.useEffect(() => {
        const rolesActivos = [rolPrincipal, ...rolesAdicionales].filter(Boolean);
        rolesActivos.forEach(rol => {
            if (menusDisponibles[rol] && (!menusSeleccionados[rol] || menusSeleccionados[rol].length === 0) && mode === 'create') {
                const todos = menusDisponibles[rol].map(m => m.cod_menu);
                setMenusSeleccionados(prev => ({ ...prev, [rol]: todos }));
            }
        });
    }, [menusDisponibles, rolPrincipal, rolesAdicionales, mode]);

    const handleRolPrincipalChange = (value) => {
        const rolAnterior = rolPrincipal;
        setRolPrincipal(value);
        setRolesAdicionales(prev => prev.filter(r => r !== value));

        // Auto-seleccionar todos los menús del nuevo rol principal
        const menusDelRol = (menusDisponibles[value] || []).map(m => m.cod_menu);

        setMenusSeleccionados(prev => {
            const nuevos = { ...prev };
            if (rolAnterior && rolAnterior !== value) delete nuevos[rolAnterior];
            nuevos[value] = menusDelRol;
            return nuevos;
        });
    };

    const handleToggleMenu = (rol, codMenu) => {
        setMenusSeleccionados(prev => {
            const menusActuales = prev[rol] || [];
            const existe = menusActuales.includes(codMenu);
            const nuevosMenus = existe ? menusActuales.filter(m => m !== codMenu) : [...menusActuales, codMenu];

            // Si desmarcó un menú, poner estado Inactivo por seguridad (si el usuario asía lo pidió)
            if (existe) {
                // Ya no cambiamos el estado automáticamente
            }

            return {
                ...prev,
                [rol]: nuevosMenus
            };
        });
    };

    const handleToggleTodosMenus = (rol) => {
        const menusDelRol = menusDisponibles[rol] || [];
        const selecActuales = menusSeleccionados[rol] || [];

        if (selecActuales.length === menusDelRol.length) {
            setMenusSeleccionados(prev => ({ ...prev, [rol]: [] }));
            // Ya no cambiamos el estado automáticamente
        } else {
            setMenusSeleccionados(prev => ({ ...prev, [rol]: menusDelRol.map(m => m.cod_menu) }));
        }
    };

    const handleToggleRolAdicional = (rol) => {
        setRolesAdicionales(prev => {
            const existe = prev.includes(rol);
            if (existe) {
                return prev.filter(r => r !== rol);
            } else {
                if (onLoadMenusForRole && !menusDisponibles[rol]) {
                    onLoadMenusForRole(rol);
                }

                // Auto-seleccionar todos los menús del nuevo rol adicional
                const menusDelRol = (menusDisponibles[rol] || []).map(m => m.cod_menu);
                setMenusSeleccionados(prevMenus => ({
                    ...prevMenus,
                    [rol]: menusDelRol
                }));

                return [...prev, rol];
            }
        });
    };

    const handleRemoveRolAdicional = (rol) => {
        setRolesAdicionales(prev => prev.filter(r => r !== rol));
        setMenusSeleccionados(prev => {
            const nuevos = { ...prev };
            delete nuevos[rol];
            return nuevos;
        });
    };

    const renderMenuTree = (menus, parentId, rol) => {
        // Filtrar menús si es un rol adicional (no mostrar lo que ya está en el principal)
        let processedMenus = [...menus];
        if (rol !== rolPrincipal) {
            const menusPrincipal = menusSeleccionados[rolPrincipal] || [];
            processedMenus = processedMenus.filter(m => !menusPrincipal.includes(m.cod_menu));
        }

        const filteredMenus = processedMenus.filter(m => m.cod_menu_padre === parentId);

        // Si no hay menús en este nivel dspués del filtro, no renderizar nada
        if (filteredMenus.length === 0 && parentId === null) {
            return <div style={{ fontSize: '12px', color: '#8c8c8c', fontStyle: 'italic', padding: '8px' }}>
                Todos los menús de este rol ya están cubiertos por el rol principal.
            </div>;
        }

        return filteredMenus.map(menu => {
            const children = processedMenus.filter(m => m.cod_menu_padre === menu.cod_menu);
            const isChecked = (menusSeleccionados[rol] || []).includes(menu.cod_menu);
            const Icon = MainIcon[menu.icono] || MainIcon.FileOutlined;

            return (
                <div key={menu.cod_menu} className={`menu-node ${parentId === null ? 'menu-node-root' : ''}`}>
                    <Main.Checkbox
                        checked={isChecked}
                        onChange={() => handleToggleMenu(rol, menu.cod_menu)}
                        disabled={mode === 'view'}
                        className="menu-checkbox"
                    >
                        <span className="menu-label"><Icon style={{ marginRight: 8 }} />{menu.nombre}</span>
                    </Main.Checkbox>
                    {children.length > 0 && (
                        <div className="menu-children">{renderMenuTree(processedMenus, menu.cod_menu, rol)}</div>
                    )}
                </div>
            );
        });
    };

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!rolPrincipal) return message.warning('Seleccione un rol principal');

            const finalPass = (mode === 'edit' && !passwordTemporal) ? null : passwordTemporal;
            if (mode === 'create' && !finalPass) return message.warning('Ingrese una contraseña');

            const dataToSend = {
                ...values,
                rol_principal: rolPrincipal,
                roles_adicionales: rolesAdicionales,
                menus_por_rol: menusSeleccionados,
                password: finalPass,
                es_password_temporal: esPasswordTemporal ? 'S' : 'N'
            };

            if (onSubmit) onSubmit(dataToSend);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const modalConfig = {
        create: { title: 'Nuevo Acceso de Usuario', subtitle: 'Gestión de credenciales y permisos', icon: <MainIcon.UserAddOutlined />, okText: 'Crear Acceso', disabled: false },
        edit: { title: 'Editar Acceso de Usuario', subtitle: 'Modifique los datos necesarios', icon: <MainIcon.EditOutlined />, okText: 'Guardar Cambios', disabled: false },
        view: { title: 'Detalle de Acceso', subtitle: 'Información de credenciales', icon: <MainIcon.EyeOutlined />, okText: null, disabled: true }
    }[mode];

    return (
        <>
            <Main.Modal
                open={visible}
                onCancel={onClose}
                footer={null}
                width={750}
                centered
                className="persona-modal"
                closable={false}
                maskClosable={false}
            >
                <div className="persona-modal-header">
                    <div className="modal-title-section">
                        <div className="modal-icon">{modalConfig.icon}</div>
                        <div>
                            <div className="modal-title">{modalConfig.title}</div>
                            <div className="modal-subtitle">{modalConfig.subtitle}</div>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} disabled={loading}>
                        <MainIcon.CloseOutlined />
                    </button>
                </div>

                <div className="persona-modal-body">
                    <Main.Form form={form} layout="vertical" disabled={modalConfig.disabled}>

                        <div className="form-section">
                            <div className="section-title">
                                <MainIcon.SolutionOutlined style={{ marginRight: '5px' }} />
                                Persona Asociada
                            </div>
                            <Main.Form.Item
                                name="cod_persona"
                                label="Seleccione la Persona"
                                rules={[{ required: true, message: 'Requerido' }]}
                            >
                                <Main.Select
                                    placeholder="Busque por nombre o documento..."
                                    disabled={mode !== 'create'}
                                    showSearch
                                    optionFilterProp="children"
                                    loading={loadingPersonas}
                                >
                                    {mode === 'create' ? (
                                        personasSinAcceso.map(p => (
                                            <Option key={p.cod_persona} value={p.cod_persona}>
                                                {p.descripcion} ({p.nro_documento})
                                            </Option>
                                        ))
                                    ) : (
                                        <Option key={persona?.cod_persona} value={persona?.cod_persona}>
                                            {persona?.descripcion}
                                        </Option>
                                    )}
                                </Main.Select>
                            </Main.Form.Item>
                        </div>

                        <div className="form-section">
                            <div className="section-title">
                                <MainIcon.KeyOutlined style={{ marginRight: '5px' }} />
                                Credenciales de Acceso
                            </div>
                            <div className="form-grid">
                                <Main.Form.Item
                                    name="usuario_pg"
                                    label="Nombre de Usuario"
                                    rules={[{ required: true, message: 'Requerido' }]}
                                >
                                    <Main.Input
                                        placeholder="Ej: jsmith"
                                        disabled={mode === 'view' || (mode === 'edit' && !!persona?.usuario_pg)}
                                    />
                                </Main.Form.Item>

                                <div>
                                    <PasswordField
                                        label={mode === 'edit' ? "Cambiar Contraseña" : "Contraseña"}
                                        value={passwordTemporal}
                                        onChange={setPasswordTemporal}
                                        autoGenerate={mode === 'create'}
                                        disabled={mode === 'view'}
                                    />
                                    <Main.Checkbox
                                        checked={esPasswordTemporal}
                                        onChange={e => setEsPasswordTemporal(e.target.checked)}
                                        style={{ marginTop: 8 }}
                                        disabled={mode === 'view'}
                                    >
                                        Contraseña temporal
                                    </Main.Checkbox>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="section-title">
                                <MainIcon.IdcardOutlined style={{ marginRight: '5px' }} />
                                Perfil y Rol
                            </div>
                            <div className="form-grid">
                                <Main.Form.Item 
                                    name="rol_principal" 
                                    label="Rol Principal"
                                    rules={[{ required: true, message: 'Requerido' }]}
                                >
                                    <Main.Select
                                        placeholder="Seleccione rol"
                                        onChange={handleRolPrincipalChange}
                                        disabled={mode === 'view'}
                                    >
                                        {rolesDisp.map(r => (
                                            <Option key={r.value} value={r.value}>{r.label}</Option>
                                        ))}
                                    </Main.Select>
                                </Main.Form.Item>
                                {/* Campo Estado Eliminado */}
                            </div>
                        </div>

                        {rolPrincipal && (
                            <div className="form-section">
                                <div className="section-title-with-action">
                                    <div className="section-title" style={{ margin: 0, border: 'none' }}>
                                        <MainIcon.UnorderedListOutlined style={{ marginRight: '5px' }} />
                                        Permisos de Menú - {rolesDisp.find(r => r.value === rolPrincipal)?.label}
                                    </div>
                                    <Main.Button size="small" type="link" onClick={() => handleToggleTodosMenus(rolPrincipal)} disabled={mode === 'view'}>
                                        {(menusSeleccionados[rolPrincipal] || []).length === (menusDisponibles[rolPrincipal] || []).length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                                    </Main.Button>
                                </div>
                                <div className="menus-container">
                                    {loadingMenus ? <Main.Spin /> : (
                                        <div className="menu-tree">
                                            {Array.isArray(menusDisponibles[rolPrincipal]) && renderMenuTree(menusDisponibles[rolPrincipal], null, rolPrincipal)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ROLES ADICIONALES (MENÚ ESPECIAL) */}
                        <div className="form-section">
                            <div className="section-title-with-action">
                                <div className="section-title" style={{ margin: 0, border: 'none' }}>
                                    <MainIcon.MergeOutlined style={{ marginRight: '5px' }} />
                                    Roles Adicionales (Menú Especial)
                                </div>
                                {mode !== 'view' && (
                                    <Main.Button
                                        type="primary"
                                        size="small"
                                        ghost
                                        icon={<MainIcon.PlusOutlined />}
                                        onClick={() => setModalRolesVisible(true)}
                                    >
                                        Gestionar Roles
                                    </Main.Button>
                                )}
                            </div>

                            {rolesAdicionales.length === 0 ? (
                                <Main.Empty description="No hay roles adicionales asignados" image={Main.Empty.PRESENTED_IMAGE_SIMPLE} />
                            ) : (
                                rolesAdicionales.map(rol => {
                                    const roleInfo = rolesDisp.find(r => r.value === rol);
                                    return (
                                        <div key={rol} className="additional-role-item" style={{ marginBottom: 16 }}>
                                            <div className="roles-header">
                                                <span><MainIcon.UserOutlined /> {roleInfo?.label}</span>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <Main.Button size="small" type="link" onClick={() => handleToggleTodosMenus(rol)} disabled={mode === 'view'}>
                                                        {(menusSeleccionados[rol] || []).length === (menusDisponibles[rol] || []).length ? 'Deseleccionar' : 'Tdo'}
                                                    </Main.Button>
                                                    {mode !== 'view' && (
                                                        <Main.Button size="small" type="text" danger icon={<MainIcon.DeleteOutlined />} onClick={() => handleRemoveRolAdicional(rol)} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="menus-container">
                                                {menusDisponibles[rol] ? (
                                                    <div className="menu-tree">
                                                        {Array.isArray(menusDisponibles[rol]) && renderMenuTree(menusDisponibles[rol], null, rol)}
                                                    </div>
                                                ) : <Main.Spin />}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                    </Main.Form>
                </div>

                <div className="persona-modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose} disabled={loading}>
                        {mode === 'view' ? 'Cerrar' : 'Cancelar'}
                    </button>
                    {modalConfig.okText && (
                        <button className="btn-modal btn-submit" onClick={handleFormSubmit} disabled={loading}>
                            {loading ? 'Guardando...' : modalConfig.okText}
                        </button>
                    )}
                </div>
            </Main.Modal>

            {/* MODAL DE SELECCIÓN DE ROLES ADICIONALES */}
            <Main.Modal
                title={<span><MainIcon.TeamOutlined style={{ marginRight: 8 }} />Roles Adicionales Disponibles</span>}
                open={modalRolesVisible}
                onCancel={() => setModalRolesVisible(false)}
                footer={[<Main.Button key="ok" type="primary" onClick={() => setModalRolesVisible(false)}>Aceptar</Main.Button>]}
                width={500}
                centered
                maskClosable={false}
            >
                <div className="roles-list-container">
                    {rolesDisp.filter(r => r.value !== rolPrincipal).map(role => {
                        const isSelected = rolesAdicionales.includes(role.value);
                        return (
                            <div
                                key={role.value}
                                className={`role-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleToggleRolAdicional(role.value)}
                            >
                                <Main.Checkbox checked={isSelected} />
                                <div className="role-info">
                                    <strong>{role.label}</strong>
                                    <div className="role-descripcion">{role.descripcion || 'Sin descripción'}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Main.Modal>
        </>
    );
};


export default UsuarioModalView;
