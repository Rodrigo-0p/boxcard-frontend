import * as React         from 'react';
import EmpresasHeaderView from './EmpresaHeaderView';
import Main from '../../../../../util/main';
import './EmpresaHeader.css';

const EmpresaHeader = ({  totalEmpresas = 0
                        , onRefreshData
                        , onCreate
                        , permisos
                        , handleExportar}) => {
  const message = Main.useMessage()

  const [loading, setLoading] = React.useState(false);

  const handleNuevaEmpresa = () => {
    onCreate()
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Si el componente padre provee una función de refresh, usarla
      if (onRefreshData) {
        await onRefreshData();
        message.success('Datos actualizados');
      } else {
        // Simular refresh por ahora
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
    <>
      <EmpresasHeaderView 
        totalEmpresas  ={ totalEmpresas     }
        loading        ={ loading           }
        onNuevaEmpresa ={ handleNuevaEmpresa}
        onRefresh      ={ handleRefresh     }
        onExportar     ={ handleExportar    }
        permisos       ={ permisos          }
      />
    </>
  );
};

export default EmpresaHeader;