import * as React from 'react';
import MainIcon from '../../../../../util/mainIcon';
import Main from '../../../../../util/main';
import { useAuth } from '../../../../../context/AuthContext';
import PasswordField from './Passwordfield';
import { getPasswordStrengthLevel } from '../../../../../util/passwordgenerator';
const { Option } = Main.Select;

const PersonaModalView = ({ visible, mode, persona, loading, onClose, onSubmit, permisos,
                            empresasDisp     = [], rolesDisp           = []    , loadingData, canSelectEmp,
                            menusDisponibles = {}, loadingMenus        = false , onLoadMenusForRole,
                            menusActivos     = {}, loadingMenusActivos = false , setLoadingMenusActivos
                          }) => {

  const { roles = {}, personas = {} } = permisos.porTabla;
  const { empresa } = useAuth()

  const canManageCredentials = mode === 'create' ? roles.insert : mode === 'edit' ? roles.update : false;
  const canManageRoles       = mode === 'create' ? roles.insert : mode === 'edit' ? roles.update : false;

  const useDefaultRole = mode === 'create'
    ? (personas.insert && !roles.insert)
    : mode === 'edit' ? (personas.update && !roles.update) : false;

  const defaultRole = 'rol_consulta';

  const message = Main.useMessage();
  const [form] = Main.Form.useForm();
  const [initialData, setInitialData] = React.useState(null);

  const [rolPrincipal       , setRolPrincipal      ] = React.useState(null);
  const [rolesAdicionales   , setRolesAdicionales  ] = React.useState([]);
  const [menusSeleccionados , setMenusSeleccionados] = React.useState({});
  const [modalRolesVisible  , setModalRolesVisible ] = React.useState(false);
  const [loadingModalRoles  , setLoadingModalRoles ] = React.useState(false);
  const [estadoLabel        , setEstadoLabel       ] = React.useState(true);
  const [hasUsuario         , setHasUsuario        ] = React.useState(false);
  const [menusActivosLoaded , setMenusActivosLoaded] = React.useState(false);
  const [passwordTemporal   , setPasswordTemporal  ] = React.useState('');
  const [esPasswordTemporal , setEsPasswordTemporal] = React.useState(true); // Flag para evitar recalcular roles

  const sessionRef = React.useRef({ initialized: false, mode: null, personaId: null });
  
  React.useEffect(() => {
    if (!visible) {
      sessionRef.current = { initialized: false, mode: null, personaId: null };
      setMenusActivosLoaded(false);
      setPasswordTemporal('');
      setEsPasswordTemporal(true);
    }
  }, [visible]);

  React.useEffect(() => {
    if (!visible) return;
      
    const currentId = persona?.cod_persona || 'CASE_CREATE';

    if (sessionRef.current.initialized && 
        sessionRef.current.mode === mode && 
        sessionRef.current.personaId === currentId) {
        
        if (mode === 'create' && empresasDisp.length === 1) {
             const currentVal = form.getFieldValue('cod_empresa');
             if (!currentVal) {
                 form.setFieldsValue({ cod_empresa: empresasDisp[0].cod_empresa });
             }
        }
        return;
    }

    sessionRef.current = { initialized: true, mode: mode, personaId: currentId };

    const loadModal = async () => {
      if (persona && mode !== 'create') {
        const data = {
          cod_persona   : persona.cod_persona     || '',
          descripcion   : persona.descripcion     || '',
          usuario_pg    : persona.usuario_pg      || '',
          nro_documento : persona.nro_documento   || '',
          nro_telef     : persona.nro_telef       || '',
          correo        : persona.correo          || '',
          rol_principal : persona.rol_principal   || '',
          estado        : persona.estado === 'A',
          password      : '',
          cod_empresa   : persona.cod_empresa     || ''
        };
        form.setFieldsValue(data);
        setInitialData(data);

        setRolPrincipal(persona.rol_principal);

        // NO configurar roles adicionales aquí
        // Esperar a que lleguen menusActivos

        setEstadoLabel(persona.estado === 'A' ? true : false);
        setHasUsuario(!!persona.usuario_pg);
      } else {
        const data = {
          estado: true,
          cod_empresa: empresasDisp.length === 1 ? empresasDisp[0].cod_empresa : empresa.cod_empresa
        };

        if (useDefaultRole) {
          data.rol_principal = defaultRole;
          setRolPrincipal(defaultRole);
          setMenusSeleccionados({});
        }

        form.resetFields();
        setInitialData(null);

        if (!useDefaultRole) {
          setRolPrincipal(null);
          setMenusSeleccionados({});
        }

        setRolesAdicionales([]);
        form.setFieldsValue(data);
        setEstadoLabel(true);
        setHasUsuario(false);
      }
    }

    loadModal();
  }, [persona, mode, visible, form, empresasDisp, useDefaultRole, defaultRole]);

  React.useEffect(() => {
    if (rolPrincipal && onLoadMenusForRole) {
      onLoadMenusForRole(rolPrincipal);
    }
  }, [rolPrincipal, onLoadMenusForRole]);

  // APLICAR MENÚS ACTIVOS EN MODO EDIT/VIEW (SOLO UNA VEZ AL CARGAR)
  React.useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && Object.keys(menusActivos).length > 0 && !loadingMenusActivos && !menusActivosLoaded && persona?.rol_principal) {
      
      // Usar persona.rol_principal como fuente de verdad, no el estado local
      const rolPrincipalReal = persona.rol_principal;
      
      // 1. Aplicar menús seleccionados
      setMenusSeleccionados(menusActivos);

      // 2. Extraer roles adicionales (todos excepto el principal de la persona)
      const todosLosRoles = Object.keys(menusActivos);
      const adicionales = todosLosRoles.filter(rol => rol !== rolPrincipalReal);
      
      // 3. Configurar roles adicionales
      setRolesAdicionales(adicionales);

      // 4. Cargar menús disponibles del rol principal si no están cargados
      if (onLoadMenusForRole && !menusDisponibles[rolPrincipalReal]) {
        onLoadMenusForRole(rolPrincipalReal);
      }

      // 5. Cargar menús disponibles de cada rol adicional
      adicionales.forEach(rol => {
        if (onLoadMenusForRole && !menusDisponibles[rol]) {
          onLoadMenusForRole(rol);
        }
      });
      
      // 6. Marcar como cargado para no ejecutar de nuevo
      setMenusActivosLoaded(true);
    }
  }, [menusActivos, loadingMenusActivos, mode, persona, onLoadMenusForRole]);

  // Auto-seleccionar TODOS los menús del rol principal SOLO en modo CREATE
  React.useEffect(() => {
    if (mode === 'edit' || mode === 'view') return;
    
    if (rolPrincipal && menusDisponibles[rolPrincipal] && !menusSeleccionados[rolPrincipal]) {
      const todosLosMenus = menusDisponibles[rolPrincipal].map(m => m.cod_menu);
      setMenusSeleccionados(prev => ({...prev, [rolPrincipal]: todosLosMenus}));
    }
  }, [rolPrincipal, menusDisponibles, mode]);

  // Auto-seleccionar menús de roles adicionales cuando se cargan (modo CREATE)
  React.useEffect(() => {
    if (mode !== 'create') return;
    
    rolesAdicionales.forEach(rol => {
      // Si el rol tiene menús disponibles pero no están seleccionados aún
      if (menusDisponibles[rol] && !menusSeleccionados[rol]) {
        const todosLosMenus = menusDisponibles[rol].map(m => m.cod_menu);
        setMenusSeleccionados(prev => ({
          ...prev,
          [rol]: todosLosMenus
        }));
      }
    });
  }, [rolesAdicionales, menusDisponibles, mode]);

  React.useEffect(() => {
    const modalBody = document.querySelector('.persona-modal-body');
    const handleScroll = () => {
      document.querySelectorAll('.ant-select-focused').forEach(select => select.blur());
      document.activeElement?.blur();
    };

    if (modalBody) modalBody.addEventListener('scroll', handleScroll);
    return () => { if (modalBody) modalBody.removeEventListener('scroll', handleScroll); };
  }, [visible]);

  const handleRolPrincipalChange = async (value) => {
    // 1. Guardar el rol anterior
    const rolAnterior = rolPrincipal;
    
    // 2. Actualizar el rol principal
    setRolPrincipal(value);
    form.setFieldsValue({ rol_principal: value });
    
    // 3. Actualizar rolesAdicionales en UNA SOLA operación
    // Eliminar tanto el rol anterior como el nuevo rol de los adicionales
    setRolesAdicionales(prev => {
      const nuevosRoles = prev.filter(r => r !== rolAnterior && r !== value);
      return nuevosRoles;
    });
    
    // 4. Actualizar menusSeleccionados - eliminar rol anterior y agregar nuevo rol
    setMenusSeleccionados(prev => {
      const nuevosMenus = { ...prev };
      
      // Eliminar menús del rol anterior
      if (rolAnterior && rolAnterior !== value) {
        delete nuevosMenus[rolAnterior];
      }
      
      // Los menús del nuevo rol se agregarán después de cargarlos
      return nuevosMenus;
    });
    
    // 5. Cargar menús del nuevo rol si no están cargados
    if (!menusDisponibles[value] && onLoadMenusForRole) {
      await onLoadMenusForRole(value);
    }
    
    // 6. Auto-seleccionar TODOS los menús del nuevo rol principal
    if (menusDisponibles[value]) {
      const todosLosMenus = menusDisponibles[value].map(m => m.cod_menu);
      setMenusSeleccionados(prev => ({
        ...prev,
        [value]: todosLosMenus
      }));
    }
  };

  const handleOpenRolesModal = async () => {
    
    setModalRolesVisible(true);
    setLoadingModalRoles(true);
    
    // Pre-cargar menús de TODOS los roles disponibles (excluyendo principal y adicionales ya asignados)
    const rolesDisponibles = rolesDisp.filter(r => 
      r.value !== rolPrincipal && !rolesAdicionales.includes(r.value)
    );
    
    // Cargar menús de todos los roles en paralelo
    const promesas = rolesDisponibles.map(rol => {
      if (!menusDisponibles[rol.value] && onLoadMenusForRole) {
        return onLoadMenusForRole(rol.value);
      }
      return Promise.resolve();
    });
    
    try {
      await Promise.all(promesas);
    } catch (error) {
      console.error('[PersonaModalView] Error pre-cargando menús:', error);
    } finally {
      setLoadingModalRoles(false);
    }
  };

  const handleCloseRolesModal = () => {
    setModalRolesVisible(false);
  };

  const handleToggleRolAdicional = (rol) => {
    
    setRolesAdicionales(prev => {
      const existe = prev.includes(rol);
      if (existe) {
        // Remover rol
        const nuevosRoles = prev.filter(r => r !== rol);
        const nuevosMenus = { ...menusSeleccionados };
        delete nuevosMenus[rol];
        setMenusSeleccionados(nuevosMenus);
        return nuevosRoles;
      } else {
        // Agregar rol (los menús ya están pre-cargados)
        return [...prev, rol];
      }
    });
  };

  const handleRemoveRolAdicional = (rol) => {
    setRolesAdicionales(prev => prev.filter(r => r !== rol));
    const nuevosMenus = { ...menusSeleccionados };
    delete nuevosMenus[rol];
    setMenusSeleccionados(nuevosMenus);
  };

  const handleToggleMenu = (rol, codMenu) => {
    setMenusSeleccionados(prev => {
      const menusActuales = prev[rol] || [];
      const existe = menusActuales.includes(codMenu);

      return {
        ...prev,
        [rol]: existe
          ? menusActuales.filter(m => m !== codMenu)
          : [...menusActuales, codMenu]
      };
    });
  };

  const handleToggleTodosMenus = (rol) => {
    const menusDelRol = menusDisponibles[rol] || [];
    const menusActuales = menusSeleccionados[rol] || [];
    const todosMarcados = menusDelRol.length === menusActuales.length;

    setMenusSeleccionados(prev => ({
      ...prev,
      [rol]: todosMarcados ? [] : menusDelRol.map(m => m.cod_menu)
    }));
  };

  // Filtrar menús para roles adicionales (sin los del rol principal)
  const getMenusFiltrados = (rol) => {
    if (!menusDisponibles[rol]) return [];

    const menusDelRolPrincipal = menusDisponibles[rolPrincipal] || [];
    const codMenusRolPrincipal = menusDelRolPrincipal.map(m => m.cod_menu);

    return menusDisponibles[rol].filter(m => !codMenusRolPrincipal.includes(m.cod_menu));
  };

  const renderMenuTree = (menus, parentId, rol) => {
    const filteredMenus = menus.filter(m => m.cod_menu_padre === parentId);

    return filteredMenus.map(menu => {
      const children = menus.filter(m => m.cod_menu_padre === menu.cod_menu);
      const hasChildren = children.length > 0;
      const isChecked = (menusSeleccionados[rol] || []).includes(menu.cod_menu);
      const Icon = MainIcon[menu.icono] || MainIcon.FileOutlined;

      return (
        <div key={menu.cod_menu} className={`menu-node ${parentId === null ? 'menu-node-root' : ''}`}>
          <div className="menu-checkbox">
            <Main.Checkbox
              checked={isChecked}
              onChange={() => handleToggleMenu(rol, menu.cod_menu)}
              disabled={mode === 'view' || !canManageRoles}
            >
              <span className="menu-label">
                <Icon style={{ marginRight: 8 }} />
                {menu.nombre}
              </span>
            </Main.Checkbox>
          </div>
          {hasChildren && (
            <div className="menu-children">
              {renderMenuTree(menus, menu.cod_menu, rol)}
            </div>
          )}
        </div>
      );
    });

  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      values.usuario_pg = await Main.nvl(values.usuario_pg, '').trim();

      if (values.usuario_pg.length > 0 && (!menusSeleccionados[rolPrincipal] || Main.nvl(menusSeleccionados[rolPrincipal], '').length === 0)) {
        message.warning('Debe seleccionar al menos un menú para el rol principal');
        return;
      }

      // VALIDAR FORTALEZA DE CONTRASEÑA (si hay contraseña)
      if (passwordTemporal && passwordTemporal.trim() !== '') {
        const strength = getPasswordStrengthLevel(passwordTemporal);
        if (strength.level === 'Débil') {
          message.warning('La contraseña es demasiado débil. Debe tener al menos nivel "Medio"');
          return;
        }
      }

      // MODIFICADO: Validar contraseña temporal generada
      if (mode === 'create' && values.usuario_pg && values.usuario_pg.trim() !== '') {
        if (!passwordTemporal || passwordTemporal.trim() === '') {
          message.warning('Debe generar o ingresar una contraseña');
          return;
        }
        if (!rolPrincipal) {
          message.warning('Debe seleccionar un rol principal para el usuario');
          return;
        }
      }

      if (mode === 'edit' && !hasUsuario && values.usuario_pg) {
        if (!passwordTemporal || passwordTemporal.trim() === '') {
          message.warning('Debe generar o ingresar una contraseña para el nuevo usuario');
          return;
        }
        if (!rolPrincipal) {
          message.warning('Debe seleccionar un rol principal para el nuevo usuario');
          return;
        }
      }

      if (mode === 'edit' && initialData) {
        const hasChanges =
          values.cod_persona   !== initialData.cod_persona   ||
          values.descripcion   !== initialData.descripcion   ||
          values.usuario_pg    !== initialData.usuario_pg    ||
          values.nro_documento !== initialData.nro_documento ||
          values.nro_telef     !== initialData.nro_telef     ||
          values.correo        !== initialData.correo        ||
          values.cod_empresa   !== initialData.cod_empresa   ||
          values.rol_principal !== initialData.rol_principal ||
          values.estado        !== initialData.estado        ||
          (passwordTemporal && passwordTemporal.trim() !== '') ||
          JSON.stringify(rolesAdicionales)   !== JSON.stringify(persona.roles_adicionales || []) ||
          JSON.stringify(menusSeleccionados) !== JSON.stringify(menusActivos);

        if (!hasChanges) {
          message.info('No hay cambios para guardar');
          return;
        }
      }

      const dataToSend = {
        ...values,
        estado               : values.estado ? 'A' : 'I',
        rol_principal        : rolPrincipal,
        roles_adicionales    : rolesAdicionales,
        menus_por_rol        : menusSeleccionados,
        password             : passwordTemporal,
        es_password_temporal : esPasswordTemporal
      };

      if (mode === 'edit' && hasUsuario) {
        if (!passwordTemporal || passwordTemporal.trim() === '') {
          delete dataToSend.password;
          delete dataToSend.es_password_temporal;
        }
      }

      if (onSubmit){
        setLoadingMenusActivos(true)
      } onSubmit(dataToSend);

    } catch (error) {
      console.error('Error en validación:', error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setRolPrincipal(null);
    setRolesAdicionales([]);
    setMenusSeleccionados({});
    setMenusActivosLoaded(false); // Reset flag para próxima vez
    if (onClose) onClose();
  };

  const modalConfig = {
    create: {
      title: 'Nueva Persona', subtitle: 'Complete la información del usuario',
      icon: <MainIcon.UserAddOutlined />, okText: 'Crear', disabled: false
    },
    edit: {
      title: 'Editar Persona', subtitle: 'Modifique los datos necesarios',
      icon: <MainIcon.EditOutlined />, okText: 'Guardar', disabled: false
    },
    view: {
      title: 'Detalle de Persona', subtitle: 'Información del usuario',
      icon: <MainIcon.EyeOutlined />, okText: null, disabled: true
    }
  };

  const config = modalConfig[mode] || modalConfig.create;
  const rolesAdicionalesDisponibles = rolesDisp.filter(r => 
    r.value !== rolPrincipal && !rolesAdicionales.includes(r.value)
  );

  return (
      <>
        
        <Main.Modal open={visible} onCancel={handleClose} footer={null} closable={false}
          width={900} className="persona-modal" centered maskClosable={false} keyboard={false}>

          <div className="persona-modal-header">
            <div className="modal-title-section">
              <div className="modal-icon">{config.icon}</div>
              <div>
                <div className="modal-title">{config.title}</div>
                <div className="modal-subtitle">{config.subtitle}</div>
              </div>
            </div>
            <button className="modal-close-btn" onClick={handleClose} disabled={loading}>
              <MainIcon.CloseOutlined />
            </button>
          </div>

          <div className="persona-modal-body">
            <Main.Form form={form} layout="vertical" disabled={config.disabled}>

              {/* INFORMACIÓN PERSONAL */}
              <div className="form-section">
                <div className="section-title">
                  <MainIcon.IdcardOutlined style={{ marginRight: '5px' }} />
                  Información Personal
                </div>
                <Main.Row gutter={[12, 0]}>
                  <Main.Col span={5}>
                    <Main.Form.Item name="cod_persona" label="Codigo Persona">
                      <Main.Input disabled={true} style={{ fontWeight: 'bold', size: '12px', textAlign: 'right' }} />
                    </Main.Form.Item>
                  </Main.Col>

                  <Main.Col span={19}>
                    <Main.Form.Item name="descripcion" label="Nombre Completo"
                      rules={[
                        { required: true, message: 'Nombre completo es requerido' },
                        { min: 3, message: 'Mínimo 3 caracteres' }
                      ]}
                      className="form-item-full">
                      <Main.Input autoFocus={true} placeholder="Ej: Juan Pérez González" maxLength={100} />
                    </Main.Form.Item>
                  </Main.Col>
                </Main.Row>

                <div className="form-grid">
                  <Main.Form.Item name="nro_documento" label="Nro. Documento"
                    rules={[
                      { required: true, message: 'Documento es requerido' },
                      { pattern: /^[\d.-]+$/, message: 'Solo números, puntos y guiones' }
                    ]}>
                    <Main.Input placeholder="Ej: 12345678" maxLength={20} onKeyDown={Main.soloNumero} />
                  </Main.Form.Item>

                  <Main.Form.Item name="nro_telef" label="Teléfono"
                    rules={[
                      { required: true, message: 'Teléfono es requerido' },
                      { pattern: /^\d+$/, message: 'Solo números' }
                    ]}>
                    <Main.Input placeholder="Ej: 0981123456" maxLength={20} />
                  </Main.Form.Item>

                  <Main.Form.Item name="correo" label="Correo Electrónico"
                    rules={[
                      { required: true, message: 'Email es requerido' },
                      { type: 'email', message: 'Email inválido' }
                    ]}
                    className="form-item-full">
                    <Main.Input placeholder="Ej: usuario@empresa.com" maxLength={100} />
                  </Main.Form.Item>
                </div>
              </div>

              {/* CREDENCIALES */}
              <div className="form-section">
                <div className="section-title">
                  <MainIcon.KeyOutlined style={{ marginRight: '5px' }} />
                  Credenciales de Acceso
                </div>

                {!canManageCredentials && mode !== 'view' && (
                  <Main.Alert message="Sin permisos para gestionar credenciales"
                    description="No tienes permisos para crear usuarios o modificar credenciales."
                    type="warning" showIcon style={{ marginBottom: 16 }} />
                )}

                <div className="form-grid">
                  {/* USUARIO */}
                  <Main.Form.Item name="usuario_pg" label="Usuario"
                    rules={[
                      { required: false, message: 'Usuario es requerido' },
                      { min: 4, message: 'Mínimo 4 caracteres' },
                      { pattern: /^[a-z0-9_]+$/, message: 'Solo minúsculas, números y guion bajo' }
                    ]}
                    tooltip="Usuario para acceder al sistema">
                    <Main.Input placeholder="Ej: jperez" maxLength={50}
                      disabled={mode === 'view' || (mode === 'edit' && hasUsuario) || (mode === 'create' && !canManageCredentials)} />
                  </Main.Form.Item>

                  {/* CONTRASEÑA - AL LADO DEL USUARIO */}
                  <Main.Form.Item noStyle shouldUpdate={(prev, curr) => prev.usuario_pg !== curr.usuario_pg}>
                    {({ getFieldValue }) => {
                      const usuario = getFieldValue('usuario_pg');
                      
                      // MODO CREATE: Generador automático al lado
                      if (mode === 'create' && canManageCredentials) {
                        return (
                          <div>
                            <PasswordField
                              value={passwordTemporal}
                              onChange={setPasswordTemporal}
                              disabled={false}
                              autoGenerate={true}
                              label="Contraseña Temporal"
                            />
                            
                            {/* Checkbox debajo del campo */}
                            <div style={{ marginTop: 8 }}>
                              <Main.Checkbox 
                                checked={esPasswordTemporal}
                                onChange={(e) => setEsPasswordTemporal(e.target.checked)}
                              >
                                <span style={{ fontSize: '12px' }}>
                                  Es contraseña temporal (debe cambiarla en el primer inicio de sesión)
                                </span>
                              </Main.Checkbox>
                            </div>
                          </div>
                        );
                      }
                      
                      // MODO EDIT sin usuario: Generador automático al lado
                      if (mode === 'edit' && !hasUsuario && usuario && usuario.trim() !== '' && canManageCredentials) {
                        return (
                          <div>
                            <PasswordField
                              value={passwordTemporal}
                              onChange={setPasswordTemporal}
                              disabled={false}
                              autoGenerate={true}
                              label="Contraseña Temporal"
                            />
                            
                            {/* Checkbox debajo del campo */}
                            <div style={{ marginTop: 8 }}>
                              <Main.Checkbox 
                                checked={esPasswordTemporal}
                                onChange={(e) => setEsPasswordTemporal(e.target.checked)}
                              >
                                <span style={{ fontSize: '12px' }}>
                                  Es contraseña temporal (debe cambiarla en el primer inicio de sesión)
                                </span>
                              </Main.Checkbox>
                            </div>
                          </div>
                        );
                      }
                      
                      // MODO EDIT con usuario: Generador opcional al lado con indicador de nivel
                      if (mode === 'edit' && hasUsuario && canManageCredentials) {
                        return (
                          <div>
                            <PasswordField
                              value={passwordTemporal}
                              onChange={setPasswordTemporal}
                              disabled={false}
                              autoGenerate={false}
                              label="Nueva Contraseña (opcional)"
                            />
                            
                            {/* Checkbox debajo del campo - Para casos de soporte */}
                            <div style={{ marginTop: 8 }}>
                              <Main.Checkbox 
                                checked={esPasswordTemporal}
                                onChange={(e) => setEsPasswordTemporal(e.target.checked)}
                              >
                                <span style={{ fontSize: '12px' }}>
                                  Es contraseña temporal (debe cambiarla en el primer inicio de sesión)
                                </span>
                              </Main.Checkbox>
                            </div>
                          </div>
                        );
                      }
                      
                      return null;
                    }}
                  </Main.Form.Item>
                </div>

                {mode === 'edit' && !hasUsuario && canManageCredentials && (
                  <Main.Alert message="Usuario no asignado"
                    description="Esta persona no tiene un usuario de acceso."
                    type="info" showIcon icon={<MainIcon.InfoCircleOutlined />} style={{ margin: '5px 0px' }} />
                )}
              </div>



              {/* CONFIGURACIÓN */}
              <div className="form-section">
                <div className="section-title">
                  <MainIcon.SettingOutlined style={{ marginRight: '5px' }} />
                  Configuración
                </div>
                <div className="form-grid">
                  <Main.Form.Item name="cod_empresa" label="Empresa"
                    rules={[{ required: true, message: 'Empresa es requerida' }]}>
                    <Main.Select placeholder="Seleccione empresa" showSearch optionFilterProp="children"
                      disabled={!canSelectEmp || loadingData}
                      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                      {empresasDisp.map(emp => (
                        <Option key={emp.cod_empresa} value={emp.cod_empresa}>{emp.nombre}</Option>
                      ))}
                    </Main.Select>
                  </Main.Form.Item>

                  <Main.Form.Item name="rol_principal" label="Rol Principal"
                    rules={[{ required: false, message: 'Rol es requerido' }]}
                    tooltip={useDefaultRole ? "Rol asignado automáticamente" : "Rol principal del usuario"}>
                    <Main.Select placeholder="Seleccione rol" onChange={handleRolPrincipalChange}
                      disabled={mode === 'view' || loadingData || !canManageRoles} loading={loadingData}>
                      {rolesDisp.map(rol => (
                        <Option key={rol.value} value={rol.value}>{rol.label}</Option>
                      ))}
                    </Main.Select>
                  </Main.Form.Item>

                  <Main.Form.Item label="Estado">
                    <div className='estadoContent'>
                      <Main.Form.Item name="estado" valuePropName="checked">
                        <Main.Switch onChange={(e) => setEstadoLabel(e)} />
                      </Main.Form.Item>
                      <span className="estadoLabel">{estadoLabel ? "Activo" : "Inactivo"}</span>
                    </div>
                  </Main.Form.Item>
                </div>
              </div>

              {!canManageRoles && mode !== 'view' && (
                <Main.Alert
                  message={useDefaultRole ? "Rol asignado automáticamente" : "Sin permisos para gestionar roles y menús"}
                  description={
                    useDefaultRole
                      ? "Se ha asignado automáticamente el rol 'Consulta Admin' con permisos de solo lectura."
                      : "No tienes permisos para asignar roles o configurar menús."
                  }
                  type={useDefaultRole ? "info" : "warning"} showIcon
                  icon={useDefaultRole ? <MainIcon.InfoCircleOutlined /> : <MainIcon.LockOutlined />}
                  style={{ marginBottom: 16 }} />
              )}

              {/* MENÚS DEL ROL PRINCIPAL */}
              {rolPrincipal && (
                <div className="form-section">
                  <div className="section-title-with-action">
                    <span className="section-title">
                      <MainIcon.AlignLeftOutlined style={{ marginRight: '5px' }} />
                      Menús del Rol Principal
                    </span>
                    {!config.disabled && canManageRoles && menusDisponibles[rolPrincipal] && (
                      <Main.Button type="link" size="small" icon={<MainIcon.CheckCircleOutlined />}
                        onClick={() => handleToggleTodosMenus(rolPrincipal)}>
                        {(menusSeleccionados[rolPrincipal] || []).length === menusDisponibles[rolPrincipal].length
                          ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                      </Main.Button>
                    )}
                  </div>

                  {loadingMenus || loadingMenusActivos ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Main.Spin />
                    </div>
                  ) : menusDisponibles[rolPrincipal] ? (
                    <div className="menus-container">
                      <div className="roles-header">
                        <span>
                          <MainIcon.UserOutlined style={{ marginRight: 8 }} />
                          {rolesDisp.find(r => r.value === rolPrincipal)?.label}
                          {useDefaultRole && <Main.Tag color="blue" style={{ marginLeft: 8 }}>Asignado automáticamente</Main.Tag>}
                        </span>
                        <Main.Tag color="blue">
                          {(menusSeleccionados[rolPrincipal] || []).length} menús seleccionados
                        </Main.Tag>
                      </div>
                      <div className="menu-tree">
                        {renderMenuTree(menusDisponibles[rolPrincipal], null, rolPrincipal)}
                      </div>
                    </div>
                  ) : (
                    <Main.Alert message="Sin menús disponibles"
                      description="No hay menús configurados para este rol" type="warning" showIcon />
                  )}
                </div>
              )}

              {/* ROLES ADICIONALES */}
              {rolPrincipal && !config.disabled && (
                <div className="form-section">
                  <div className="section-title-with-action">
                    <span className="section-title">
                      <MainIcon.MergeOutlined style={{ marginRight: '5px' }} />
                      Roles Adicionales y Menús Especiales
                    </span>
                    <Main.Button type="primary" size="middle" icon={<MainIcon.PlusOutlined />}
                      onClick={handleOpenRolesModal} disabled={!canManageRoles}>
                      Agregar Roles
                    </Main.Button>
                  </div>

                  {rolesAdicionales.length === 0 ? (
                    <Main.Alert message="Sin roles adicionales"
                      description={canManageRoles
                        ? "Puede agregar roles adicionales para asignar menús especiales"
                        : "No tienes permisos para agregar roles adicionales"}
                      type="info" showIcon icon={<MainIcon.InfoCircleOutlined />} />
                  ) : (
                    rolesAdicionales.map(rol => {
                      const menusFiltrados      = getMenusFiltrados(rol);
                      const menusDelRolCargados = menusDisponibles[rol];
                      
                      return (
                        <div key={rol} className="menus-container" style={{ marginBottom: 16 }}>
                          <div className="roles-header">
                            <span>
                              <MainIcon.UserOutlined style={{ marginRight: 8 }} />
                              {rolesDisp.find(r => r.value === rol)?.label}
                            </span>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <Main.Tag color="green">
                                {(menusSeleccionados[rol] || []).length} menús especiales
                              </Main.Tag>
                              {canManageRoles && (
                                <>
                                  <Main.Button type="link" size="small" icon={<MainIcon.CheckSquareOutlined />}
                                    onClick={() => handleToggleTodosMenus(rol)}
                                    disabled={!menusFiltrados || menusFiltrados.length === 0}>
                                    Todo
                                  </Main.Button>
                                  <Main.Button type="text" size="small" danger icon={<MainIcon.CloseOutlined />}
                                    onClick={() => handleRemoveRolAdicional(rol)} />
                                </>
                              )}
                            </div>
                          </div>
                          {!menusDelRolCargados ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                              <Main.Spin/>
                            </div>
                          ) : menusFiltrados.length > 0 ? (
                            <div className="menu-tree">
                              {renderMenuTree(menusFiltrados, null, rol)}
                            </div>
                          ) : (
                            <Main.Alert message="Todos los menús ya están en el rol principal"
                              description="Este rol no tiene menús adicionales disponibles"
                              type="info" showIcon style={{ margin: '10px 0' }} />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* VISTA DE ROLES ADICIONALES (MODO VIEW) */}
              {config.disabled && rolesAdicionales.length > 0 && (
                <div className="form-section">
                  <div className="section-title">
                    <MainIcon.MergeOutlined style={{ marginRight: '5px' }} />
                    Roles Adicionales y Menús Especiales
                  </div>
                  {rolesAdicionales.map(rol => {
                    const menusFiltrados      = getMenusFiltrados(rol);
                    const menusDelRolCargados = menusDisponibles[rol];
                    
                    return (
                      <div key={rol} className="menus-container" style={{ marginBottom: 16 }}>
                        <div className="roles-header">
                          <span>
                            <MainIcon.UserOutlined style={{ marginRight: 8 }} />
                            {rolesDisp.find(r => r.value === rol)?.label}
                          </span>
                          <Main.Tag color="green">
                            {(menusSeleccionados[rol] || []).length} menús especiales
                          </Main.Tag>
                        </div>
                        {!menusDelRolCargados ? (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Main.Spin/>
                          </div>
                        ) : menusFiltrados.length > 0 && (
                          <div className="menu-tree">
                            {renderMenuTree(menusFiltrados, null, rol)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </Main.Form>
          </div>

          <div className="persona-modal-footer">
            <button className="btn-modal btn-cancel" onClick={handleClose} disabled={loading}>
              {mode === 'view' ? 'Cerrar' : 'Cancelar'}
            </button>
            {config.okText && (
              <button className="btn-modal btn-submit" onClick={handleFormSubmit} disabled={loading}>
                {loading ? 'Guardando...' : config.okText}
              </button>
            )}
          </div>
        </Main.Modal>

        {/* MODAL PARA SELECCIONAR ROLES ADICIONALES */}
        <Main.Modal
          title={<span><MainIcon.TeamOutlined style={{ marginRight: 8 }} />Seleccionar Roles Adicionales</span>}
          open={modalRolesVisible} onCancel={handleCloseRolesModal}
          footer={[<Main.Button key="close" onClick={handleCloseRolesModal} disabled={loadingModalRoles}>Cerrar</Main.Button>]}
          width={600}>
          {loadingModalRoles ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Main.Spin size="large"/>
            </div>
          ) : (
            <div className="roles-list-container">
              {rolesAdicionalesDisponibles.map(rol => {
                const isSelected = rolesAdicionales.includes(rol.value);
                return (
                  <div key={rol.value} className={`role-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleRolAdicional(rol.value)}>
                    <Main.Checkbox checked={isSelected} />
                    <div className="role-info">
                      <strong>{rol.label}</strong>
                      <div className="role-descripcion">{rol.descripcion}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )} 
        </Main.Modal>
    </>
  );
};

export default PersonaModalView;