import * as React from 'react';
import EmpresasCardsView from './EmpresasCardsView';
import Main     from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import './EmpresaCards.css';

const EmpresasCards = ({ empresas
                       , loading
                       , onEdit 
                       , onView
                       , permisos
                       , saveDelete
                      }) => {
  
  const handleDelete = (empresa) => {
    Main.Modal.confirm({
      title      : '¿Eliminar empresa?',
      icon       : <MainIcon.ExclamationCircleOutlined />,
      content    : `¿Está seguro que desea eliminar "${empresa.nombre}"?`,
      okText     : 'Eliminar',
      okType     : 'danger',
      cancelText : 'Cancelar',
      onOk: async () => {
       saveDelete(empresa.cod_empresa);
      }
    });
  };

  return (
    <EmpresasCardsView
      empresas  ={ empresas     }
      loading   ={ loading      }
      onView    ={ onView       }
      onEdit    ={ onEdit       }
      onDelete  ={ handleDelete }
      permisos  ={ permisos     }
    />
  );
};

export default EmpresasCards;