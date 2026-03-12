import * as React from 'react';
import PersonaModalView from './PersonaModalView';
import MainUrl from '../../url/mainUrl';
import Main from '../../../../../util/main';
import './PersonaModal.css'

const PersonaModal = ({ visible, mode = 'create', persona = null, onClose, onSave, permisos }) => {
  const [loading, setLoading] = React.useState(false);
  const [empresasDisp, setEmpresasDisp] = React.useState([]);
  const [canSelectEmp, setCanSelectEmp] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);

  const message = Main.useMessage();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error guardando persona:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && onClose) {
      onClose();
    }
  };

  React.useEffect(() => {
    if (visible && mode !== 'view') {
      loadModalData();
    }
  }, [visible, mode, persona]);

  const loadModalData = async () => {
    setLoadingData(true);
    try {
      const empresasResp = await Main.Request(MainUrl.url_get_empresa, 'GET', {});

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
      loadingData={loadingData}
      canSelectEmp={canSelectEmp}
    />
  );
};

export default PersonaModal;
