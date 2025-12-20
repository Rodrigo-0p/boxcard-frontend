import * as React from 'react';
import Main       from '../../../../../util/main';
import PersonaHeaderView from './PersonaHeaderView';

const PersonaHeader = ({ totalPersonas
                       , onRefreshData
                       , onCreate
                       , permisos 
                       , handleExportar}) => {
  
  const message = Main.useMessage();
  const [loading, setLoading] = React.useState(false);
  
  const handleNuevaEmpresa = () => {
    onCreate()
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      if (onRefreshData) {
        await onRefreshData();
        message.success('Datos actualizados');
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('Datos actualizados');
      }
    } catch (error) {
      console.error('Error al refrescar:', error);
      message.error('Error al actualizar datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PersonaHeaderView
      totalPersonas   = { totalPersonas      }
      loading         = { loading            }
      onRefresh       = { handleRefresh      }
      onCreate        = { handleNuevaEmpresa }
      onExportar      = { handleExportar     }
      permisos        = { permisos           }
    />
  );
};

export default PersonaHeader;