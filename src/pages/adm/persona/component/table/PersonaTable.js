import React          from 'react';
import Main           from '../../../../../util/main';
import MainIcon       from '../../../../../util/mainIcon';
import PersonaTableView from './PersonaTableView';

import './PersonaTable.css';

const PersonaTable = ({  personas
                       , loading
                       , onEdit
                       , onView
                       , permisos
                       , saveDelete
                      }) => {
const message = Main.useMessage();

const [pagination, setPagination] = React.useState({ current         : 1,
                                                     pageSize        : 10,
                                                     total           : personas.length,
                                                     showSizeChanger : true,
                                                     showTotal       : (total) => `Total ${total} personas`,                                                     
                                                     pageSizeOptions : ['10', '20', '50', '100']
                                                  });

  const [sortedInfo   , setSortedInfo  ] = React.useState({});
  const [filteredInfo , setFilteredInfo] = React.useState({});

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };


  const handleDelete = (persona) => {
     Main.Modal.confirm({
      title      : '¿Confirmar eliminación?',
      icon       : <MainIcon.ExclamationCircleOutlined />,
      content    : `¿Está seguro que desea eliminar a "${persona.descripcion}"?`,
      okText     : 'Eliminar',
      okType     : 'danger',
      cancelText : 'Cancelar',
      onOk() {
        saveDelete(persona.cod_persona);
      },
    });
  };

  return (
    <PersonaTableView
      personas      = { personas          }
      loading       = { loading           }
      pagination    = { pagination        }
      sortedInfo    = { sortedInfo        }
      filteredInfo  = { filteredInfo      }
      onTableChange = { handleTableChange }
      onView        = { onView            }
      onEdit        = { onEdit            }
      onDelete      = { handleDelete      }
      permisos      = { permisos          }
    />
  );
};
export default PersonaTable;