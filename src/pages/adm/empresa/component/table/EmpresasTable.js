import React             from 'react';
import Main              from '../../../../../util/main';
import MainIcon          from '../../../../../util/mainIcon';
import EmpresasTableView from './EmpresasTableView';

import './EmpresasTable.css';

const EmpresasTable = ({  empresas
                        , loading
                        , onEdit
                        , onView
                        , permisos
                        , saveDelete
                      }) => {
const message = Main.useMessage();

const [pagination, setPagination] = React.useState({ current         : 1,
                                                     pageSize        : 10,
                                                     total           : empresas.length,
                                                     showSizeChanger : true,
                                                     showTotal       : (total) => `Total ${total} empresas`,                                                     
                                                     pageSizeOptions : ['10', '20', '50', '100']
                                                  });

  const [sortedInfo   , setSortedInfo  ] = React.useState({});
  const [filteredInfo , setFilteredInfo] = React.useState({});

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };


  const handleDelete = (empresa) => {
     Main.Modal.confirm({
      title      : '¿Confirmar eliminación?',
      icon       : <MainIcon.ExclamationCircleOutlined />,
      content    : `¿Está seguro que desea eliminar la empresa "${empresa.nombre}"?`,
      okText     : 'Eliminar',
      okType     : 'danger',
      cancelText : 'Cancelar',
      onOk() {
        saveDelete(empresa.cod_empresa);
      },
    });
  };

  return (
    <EmpresasTableView
      empresas      = { empresas          }
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
export default EmpresasTable;