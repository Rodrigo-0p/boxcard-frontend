import * as React from 'react';
import UsuarioModalView from './UsuarioModalView';
import MainUrl from '../../url/mainUrl';
import Main from '../../../../../util/main';
import './UsuarioModal.css'

const UsuarioModal = ({ visible, mode = 'create', persona = null, onClose, onSave, permisos }) => {
    const [loading, setLoading] = React.useState(false);
    const [rolesDisp, setRolesDisp] = React.useState([]);
    const [loadingData, setLoadingData] = React.useState(false);
    const [menusDisponibles, setMenusDisponibles] = React.useState({});
    const [loadingMenus, setLoadingMenus] = React.useState(false);
    const [menusActivos, setMenusActivos] = React.useState({});
    const [loadingMenusActivos, setLoadingMenusActivos] = React.useState(false);

    // Lista de personas sin usuario (para el selector en modo create)
    const [personasSinAcceso, setPersonasSinAcceso] = React.useState([]);
    const [loadingPersonas, setLoadingPersonas] = React.useState(false);

    const message = Main.useMessage();

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            if (onSave) {
                await onSave(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error guardando usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading && onClose) {
            setMenusDisponibles({});
            setMenusActivos({});
            setMenusActivos({});
            setPersonasSinAcceso([]);
            onClose();
        }
    };

    React.useEffect(() => {
        if (visible) {
            loadInitialData();
        }
    }, [visible, mode, persona]);

    const loadInitialData = async () => {
        setLoadingData(true);
        try {
            const resp = await Main.Request(MainUrl.url_get_roles, 'GET', {});
            if (resp.data.success) {
                setRolesDisp(resp.data.data);
            }

            if (mode === 'create') {
                loadPersonasSinAcceso();
            } else if (persona?.cod_persona) {
                loadMenusActivos(persona.cod_persona);
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const loadPersonasSinAcceso = async () => {
        setLoadingPersonas(true);
        try {
            // Usamos el mismo endpoint de listar pero filtramos en el cliente o creamos uno nuevo
            // Por simplicidad, el listar actual ya trae si tiene usuario o no.
            const resp = await Main.Request(MainUrl.url_listar, 'GET', {});
            if (resp.data.success) {
                const sinAcceso = resp.data.data.filter(p => !p.usuario_pg);
                setPersonasSinAcceso(sinAcceso);
            }
        } catch (error) {
            console.error('Error cargando personas:', error);
        } finally {
            setLoadingPersonas(false);
        }
    };

    const loadMenusForRole = async (rol) => {
        if (!rol || menusDisponibles[rol]) return;
        setLoadingMenus(true);
        try {
            const response = await Main.Request(`${MainUrl.url_get_menus}?rol=${rol}`, 'GET');
            if (response.data.success) {
                setMenusDisponibles(prev => ({ ...prev, [rol]: response.data.data }));
            }
        } catch (error) {
            console.error('Error cargando menús:', error);
        } finally {
            setLoadingMenus(false);
        }
    };

    const loadMenusActivos = async (cod_persona) => {
        setLoadingMenusActivos(true);
        try {
            const response = await Main.Request(`${MainUrl.url_get_menus_persona}?cod_persona=${cod_persona}`, 'GET');
            if (response.data.success) {
                setMenusActivos(response.data.data);
            }
        } catch (error) {
            console.error('Error cargando menús activos:', error);
        } finally {
            setLoadingMenusActivos(false);
        }
    };

    return (
        <UsuarioModalView
            mode={mode}
            visible={visible}
            persona={persona}
            loading={loading}
            onClose={handleClose}
            onSubmit={handleSubmit}
            permisos={permisos}
            rolesDisp={rolesDisp}
            loadingData={loadingData}
            menusDisponibles={menusDisponibles}
            loadingMenus={loadingMenus}
            onLoadMenusForRole={loadMenusForRole}
            menusActivos={menusActivos}
            loadingMenusActivos={loadingMenusActivos}
            personasSinAcceso={personasSinAcceso}
            loadingPersonas={loadingPersonas}
        />
    );
};

export default UsuarioModal;
