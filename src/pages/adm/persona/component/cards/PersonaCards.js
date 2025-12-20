import * as React from 'react';
import PersonaCardsView from './PersonaCardsView';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import './PersonaCards.css';

const PersonaCards = ({ personas
                      , loading
                      , onEdit 
                      , onView
                      , permisos
                      , saveDelete
                     }) => {
  
  const handleDelete = (persona) => {
    Main.Modal.confirm({
      title      : '¿Eliminar persona?',
      icon       : <MainIcon.ExclamationCircleOutlined />,
      content    : `¿Está seguro que desea eliminar "${persona.descripcion}"?`,
      okText     : 'Eliminar',
      okType     : 'danger',
      cancelText : 'Cancelar',
      onOk: async () => {
       saveDelete(persona.cod_persona);
      }
    });
  };

  return (
    <PersonaCardsView
      personas  ={ personas     }
      loading   ={ loading      }
      onView    ={ onView       }
      onEdit    ={ onEdit       }
      onDelete  ={ handleDelete }
      permisos  ={ permisos     }
    />
  );
};

export default PersonaCards;