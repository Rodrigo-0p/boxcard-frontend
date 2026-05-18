import * as React from 'react';
import Main from '../../../../../util/main';
import MainUrl from '../../url/mainUrl';
import RolesHeader from './header/RolesHeader';
import RolesList from './list/RolesList';
import MenusTree from '../shared/MenusTree';

const RolesTab = ({ initialMenus }) => {
    const [roles, setRoles] = React.useState([]);
    const [allMenus, setAllMenus] = React.useState(initialMenus || []);
    const [selectedRole, setSelectedRole] = React.useState(null);
    const [checkedMenus, setCheckedMenus] = React.useState([]);
    
    // Almacén de estados de todos los roles (editados o cargados)
    const [allRoleMenus, setAllRoleMenus] = React.useState({});
    // Almacén de estados originales del servidor para detectar cambios
    const [originalRoleMenus, setOriginalRoleMenus] = React.useState({});
    
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    
    const message = Main.useMessage();
    const { permisos } = Main.useAuth();

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const fetchMenus = (!allMenus || allMenus.length === 0);
            
            const [rolesResp, menusResp] = await Promise.all([
                Main.Request(MainUrl.url_roles_listar, 'GET'),
                fetchMenus ? Main.Request(`${MainUrl.url_menus_listar}?soloActivos=true`, 'GET') : Promise.resolve({ data: { success: true, data: allMenus } })
            ]);

            if (rolesResp.data.success) setRoles(rolesResp.data.data || []);
            if (menusResp.data.success) setAllMenus(menusResp.data.data || []);
            
        } catch (error) {
            message.error('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadInitialData();
    }, []);

    React.useEffect(() => {
        if (initialMenus) {
            setAllMenus(initialMenus);
        }
    }, [initialMenus]);

    // Sincronizar checkedMenus con el almacén global cuando cambian localmente
    const handleCheckMenus = (checked) => {
        setCheckedMenus(checked);
        if (selectedRole) {
            setAllRoleMenus(prev => ({
                ...prev,
                [selectedRole]: checked
            }));
        }
    };

    const fetchRoleMenus = async (roleId) => {
        // Antes de cambiar, nos aseguramos de que el rol actual esté guardado en el buffer
        if (selectedRole) {
            setAllRoleMenus(prev => ({ ...prev, [selectedRole]: checkedMenus }));
        }

        // Si ya tenemos los datos en el buffer (cargados o editados), los usamos
        if (allRoleMenus[roleId]) {
            setSelectedRole(roleId);
            setCheckedMenus(allRoleMenus[roleId]);
            return;
        }

        setLoading(true);
        try {
            const resp = await Main.Request(`${MainUrl.url_roles_menus}/${roleId}`, 'GET');
            if (resp.data.success) {
                const checked = (resp.data.data || []).map(id => id.toString());
                setSelectedRole(roleId);
                setCheckedMenus(checked);
                // Inicializar ambos almacenes con el dato del servidor
                setAllRoleMenus(prev => ({ ...prev, [roleId]: checked }));
                setOriginalRoleMenus(prev => ({ ...prev, [roleId]: checked }));
            }
        } catch (error) {
            message.error('Error al obtener menús del rol');
        } finally {
            setLoading(false);
        }
    };

    // Identificar qué roles han sido modificados
    const getDirtyRoles = () => {
        const dirty = [];
        Object.keys(allRoleMenus).forEach(roleId => {
            const current = [...(allRoleMenus[roleId] || [])].sort();
            const original = [...(originalRoleMenus[roleId] || [])].sort();
            if (!Main._.isEqual(current, original)) {
                dirty.push({
                    cod_role: roleId, // Es un string (nombre del rol en Postgres)
                    menus: current.map(id => parseInt(id))
                });
            }
        });
        return dirty;
    };

    const handleSaveAll = async () => {
        const updates = getDirtyRoles();
        if (updates.length === 0) {
            message.info('No hay cambios pendientes para guardar');
            return;
        }

        setSaving(true);
        try {
            const resp = await Main.Request(MainUrl.url_roles_menus_guardar_bulk, 'POST', { updates });
            if (resp.data.success) {
                message.success(resp.data.message);
                // Sincronizar el estado original con el actual tras el éxito
                setOriginalRoleMenus(Main._.clone(allRoleMenus));
            }
        } catch (error) {
            message.error('Error al realizar el guardado masivo');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (dirtyCount === 0) return;
        
        Main.Modal.confirm({
            title: '¿Revertir cambios?',
            content: 'Se perderán todas las modificaciones no guardadas en todos los roles configurados.',
            okText: 'Sí, Revertir',
            cancelText: 'No, mantener',
            onOk: () => {
                setAllRoleMenus(Main._.clone(originalRoleMenus));
                if (selectedRole) {
                    setCheckedMenus(originalRoleMenus[selectedRole] || []);
                }
                message.info('Cambios revertidos correctamente');
            }
        });
    };

    const activePermisos = permisos?.roles || { update: true };
    const dirtyCount = getDirtyRoles().length;

    return (
        <div className="roles-tab-container">
            <RolesHeader 
                onRefreshData={loadInitialData} 
                onSave={handleSaveAll} 
                onCancel={handleCancel}
                saving={saving}
                selectedRole={selectedRole}
                permisos={activePermisos}
                dirtyCount={dirtyCount}
            />

            <div style={{ display: 'flex', gap: '32px', minHeight: '500px' }}>
                <RolesList 
                    roles={roles} 
                    selectedRole={selectedRole} 
                    onSelect={fetchRoleMenus} 
                    loading={loading}
                />

                <div style={{ flex: 1 }}>
                    {selectedRole ? (
                        <div style={{ marginTop: '16px' }}>
                            <MenusTree 
                                menus={allMenus} 
                                checkedKeys={checkedMenus} 
                                onCheck={handleCheckMenus} 
                                loading={loading}
                            />
                        </div>
                    ) : (
                        <div style={{ 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: '#fafafa',
                            borderRadius: '12px',
                            border: '1px dashed #d9d9d9'
                        }}>
                            <Main.Empty 
                                description="Seleccione un rol del panel izquierdo para gestionar sus accesos por menú" 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RolesTab;
