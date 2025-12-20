import * as React from 'react';
import PersonaModalView from './PersonaModalView';
import MainUrl from '../../url/mainUrl';
import Main from '../../../../../util/main';
import './PersonaModal.css'

const PersonaModal = ({ visible, mode = 'create', persona = null, onClose, onSave, permisos }) => {
  const [loading            , setLoading            ] = React.useState(false);
  const [empresasDisp       , setEmpresasDisp       ] = React.useState([]);
  const [rolesDisp          , setRolesDisp          ] = React.useState([]);
  const [canSelectEmp       , setCanSelectEmp       ] = React.useState(false);
  const [loadingData        , setLoadingData        ] = React.useState(false);
  const [menusDisponibles   , setMenusDisponibles   ] = React.useState({});
  const [loadingMenus       , setLoadingMenus       ] = React.useState(false);
  const [menusActivos       , setMenusActivos       ] = React.useState({});
  const [loadingMenusActivos, setLoadingMenusActivos] = React.useState(false);
  const message = Main.useMessage();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      // Limpiar estados ANTES de cerrar
      setMenusDisponibles({});
      setMenusActivos({});
      setLoadingMenus(false);
      setLoadingMenusActivos(false);
      onClose();
    } catch (error) {
      console.error('Error guardando persona:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && onClose) {
      // Limpiar estados al cerrar
      setMenusDisponibles({});
      setMenusActivos({});
      setLoadingMenus(false);
      setLoadingMenusActivos(false);
      onClose();
    }
  };

  React.useEffect(() => {
    if (visible && mode !== 'view') {
      loadModalData();
    }
    
    // Cargar menús activos en modo EDIT/VIEW
    if (visible && (mode === 'edit' || mode === 'view') && persona?.cod_persona) {
      loadMenusActivos(persona.cod_persona);
    }
  }, [visible, mode, persona]);

  const loadModalData = async () => {
    setLoadingData(true);
    try {
      // Cargar roles y empresas en paralelo
      const [rolesResp, empresasResp] = await Promise.all([
        Main.Request(MainUrl.url_get_roles, 'GET', {}),
        Main.Request(MainUrl.url_get_empresa, 'GET', {})
      ]);

      // Procesar roles
      if (rolesResp.data.success) {
        setRolesDisp(rolesResp.data.data);
      } else {
        message.error('Error al cargar roles');
      }

      // Procesar empresas
      if (empresasResp.data.success) {
        setEmpresasDisp(empresasResp.data.data);
        setCanSelectEmp(empresasResp.data.can_select || false);
      } else {
        message.error('Error al cargar empresas');
      }

    } catch (error) {
      console.error('Error cargando datos del modal:', error);
      message.error('Error al cargar datos');
    } finally {
      setLoadingData(false);
    }
  }

  const loadMenusForRole = async (rol) => {
    if (!rol || menusDisponibles[rol]) {
      return; // Ya cargado
    }
    
    setLoadingMenus(true);
    
    try {
      const response = await Main.Request(`${MainUrl.url_get_menus}?rol=${rol}`, 'GET');
      if (response.data.success) {
        setMenusDisponibles(prev => {
          const nuevo = {
            ...prev,
            [rol]: response.data.data
          };
          return nuevo;
        });
      } else {
        console.error('[PersonaModal] Error en respuesta - success=false');
      }
    } catch (error) {
      console.error('[PersonaModal] Error cargando menús:', error);
    } finally {
      setLoadingMenus(false);
    }
  };

  // NUEVA FUNCIÓN: Cargar menús activos de la persona
  const loadMenusActivos = async (cod_persona) => {
    setLoadingMenusActivos(true);
    try {
      const response = await Main.Request(`${MainUrl.url_get_menus_persona}?cod_persona=${cod_persona}`, 'GET');
    
      if (response.data.success) {
        setMenusActivos(response.data.data);
      } else {
        console.error('Error al cargar menús activos:', response.data.message);
      }
    } catch (error) {
      console.error('Error cargando menús activos:', error);
    } finally {
      setLoadingMenusActivos(false);
    }
  };

  return (
    <PersonaModalView
      mode={mode}
      visible={visible}
      persona={persona}
      loading={loading}
      onClose={handleClose}
      onSubmit={handleSubmit}
      permisos={permisos}
      empresasDisp={empresasDisp}
      rolesDisp={rolesDisp}
      loadingData={loadingData}
      canSelectEmp={canSelectEmp}
      menusDisponibles={menusDisponibles}
      loadingMenus={loadingMenus}
      onLoadMenusForRole={loadMenusForRole}
      menusActivos={menusActivos}
      loadingMenusActivos={loadingMenusActivos}
      setLoadingMenusActivos={setLoadingMenusActivos}
    />
  );
};

export default PersonaModal;