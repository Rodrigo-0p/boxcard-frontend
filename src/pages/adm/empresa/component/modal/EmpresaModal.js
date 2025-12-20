import * as React       from 'react';
import EmpresaModalView from './EmpresaModalView';
import './EmpresaModal.css'

const EmpresaModal = ({ visible, mode = 'create', empresa = null, onClose, onSave, permisos }) => {
  const [loading, setLoading] = React.useState(false)
  
  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error guardando empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && onClose) {
      onClose();
    }
  };

  return (
    <EmpresaModalView
      visible  = { visible     }
      mode     = { mode        }
      empresa  = { empresa     }
      loading  = { loading     }
      onClose  = { handleClose }
      onSubmit = { handleSubmit}
      permisos = { permisos    }
    />
  );
};

export default EmpresaModal;