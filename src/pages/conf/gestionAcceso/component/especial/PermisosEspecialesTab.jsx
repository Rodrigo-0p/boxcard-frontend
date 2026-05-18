import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import MainUrl from '../../url/mainUrl';
import EspecialHeader from './header/EspecialHeader';
import UserList from './list/UserList';
import MenusTree from '../shared/MenusTree';

const PermisosEspecialesTab = ({ initialMenus }) => {
    const [users, setUsers] = React.useState([]);
    const [allMenus, setAllMenus] = React.useState(initialMenus || []);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [checkedMenus, setCheckedMenus] = React.useState([]);
    
    // Almacén de estados de todos los usuarios (especiales actuales/editados)
    const [allUsersEspecial, setAllUsersEspecial] = React.useState({});
    // Almacén de estados originales del servidor
    const [originalUsersEspecial, setOriginalUsersEspecial] = React.useState({});
    
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    
    const message = Main.useMessage();
    const { permisos } = Main.useAuth();

    const loadData = async () => {
        setLoading(true);
        try {
            const fetchMenus = (!allMenus || allMenus.length === 0);

            const [uResp, mResp, pResp] = await Promise.all([
                Main.Request('/adm/usuario/listar', 'GET'),
                fetchMenus ? Main.Request(`${MainUrl.url_menus_listar}?soloActivos=true`, 'GET') : Promise.resolve({ data: { success: true, data: allMenus } }),
                Main.Request(MainUrl.url_especiales_listar, 'GET')
            ]);

            if (uResp.data.success) setUsers(uResp.data.data || []);
            if (mResp.data.success) setAllMenus(mResp.data.data || []);
            
            if (pResp.data.success) {
                const perms = pResp.data.data || [];
                // Agrupar por usuario
                const userMap = {};
                perms.forEach(p => {
                    if (!userMap[p.usuario_pg]) userMap[p.usuario_pg] = [];
                    userMap[p.usuario_pg].push(p.cod_menu.toString());
                });
                
                setAllUsersEspecial(userMap);
                setOriginalUsersEspecial(Main._.clone(userMap));
            }
        } catch (error) {
            message.error('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadData();
    }, []);

    React.useEffect(() => {
        if (initialMenus) {
            setAllMenus(initialMenus);
        }
    }, [initialMenus]);

    const handleSelectUser = (userPg) => {
        // Antes de cambiar, guardar estado actual del anterior
        if (selectedUser) {
            setAllUsersEspecial(prev => ({ ...prev, [selectedUser]: checkedMenus }));
        }
        
        setSelectedUser(userPg);
        setCheckedMenus(allUsersEspecial[userPg] || []);
    };

    const handleCheckMenus = (checked) => {
        setCheckedMenus(checked);
        if (selectedUser) {
            setAllUsersEspecial(prev => ({
                ...prev,
                [selectedUser]: checked
            }));
        }
    };

    const getDirtyUsers = () => {
        const dirty = [];
        const allUserKeys = new Set([...Object.keys(allUsersEspecial), ...Object.keys(originalUsersEspecial)]);
        
        allUserKeys.forEach(userPg => {
            const current = [...(allUsersEspecial[userPg] || [])].sort();
            const original = [...(originalUsersEspecial[userPg] || [])].sort();
            
            if (!Main._.isEqual(current, original)) {
                dirty.push({
                    usuario_pg: userPg,
                    menus: current.map(id => parseInt(id)),
                    cod_role: 'ADMIN' // Por defecto o podríamos buscar el rol del user
                });
            }
        });
        return dirty;
    };

    const handleSaveAll = async () => {
        const updates = getDirtyUsers();
        if (updates.length === 0) {
            message.info('No hay cambios pendientes');
            return;
        }

        setSaving(true);
        try {
            const resp = await Main.Request(MainUrl.url_especiales_guardar_bulk, 'POST', { updates });
            if (resp.data.success) {
                message.success(resp.data.message);
                setOriginalUsersEspecial(Main._.clone(allUsersEspecial));
            } else {
                message.error(resp.data.message);
            }
        } catch (error) {
            message.error('Error al realizar el guardado masivo');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        const dirtyCount = getDirtyUsers().length;
        if (dirtyCount === 0) return;
        
        Main.Modal.confirm({
            title: '¿Revertir cambios?',
            content: 'Se perderán todas las personalizaciones de navegación no guardadas.',
            okText: 'Sí, Revertir',
            onOk: () => {
                setAllUsersEspecial(Main._.clone(originalUsersEspecial));
                if (selectedUser) {
                    setCheckedMenus(originalUsersEspecial[selectedUser] || []);
                }
                message.info('Cambios revertidos');
            }
        });
    };

    const activePermisos = permisos?.especiales || { update: true };
    const dirtyCount = getDirtyUsers().length;

    return (
        <div className="especiales-tab-container">
            <EspecialHeader 
                onRefreshData={loadData} 
                onSave={handleSaveAll}
                onCancel={handleCancel}
                saving={saving}
                dirtyCount={dirtyCount}
                permisos={activePermisos}
            />

            <div style={{ display: 'flex', gap: '32px', marginTop: '24px', minHeight: '500px' }}>
                <UserList 
                    users={users}
                    selectedUser={selectedUser}
                    onSelect={handleSelectUser}
                    loading={loading}
                    assignedPerms={
                        // Transformar allUsersEspecial a formato plano para los contadores del UserList
                        Object.keys(allUsersEspecial).flatMap(userPg => 
                            allUsersEspecial[userPg].map(menuId => ({ usuario_pg: userPg, cod_menu: menuId }))
                        )
                    }
                />

                <div style={{ flex: 1 }}>
                    {selectedUser ? (
                        <MenusTree 
                            menus={allMenus}
                            checkedKeys={checkedMenus}
                            onCheck={handleCheckMenus}
                            loading={loading}
                            title={`PERSONALIZACIÓN: ${selectedUser}`}
                        />
                    ) : (
                        <div style={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: '#fafafa',
                            borderRadius: '12px',
                            border: '1px dashed #d9d9d9',
                            padding: '40px'
                        }}>
                            <MainIcon.UserOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                            <Main.Empty 
                                description="Seleccione un usuario de la lista para personalizar su estructura de navegación" 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermisosEspecialesTab;
