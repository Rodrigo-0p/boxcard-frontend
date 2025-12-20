import * as React  from 'react';
import Main        from '../../../util/main';
import MainUrl     from './url/mainUrl';
import { useAuth } from '../../../context/AuthContext';
// COMPONENT
import EmpresaHeader       from './component/header/EmpresaHeader';
import EmpresasToolbar     from './component/toolBar/EmpresaToolBar';
import EmpresasCards       from './component/cards/EmpresasCards';
import EmpresasTable       from './component/table/EmpresasTable';
import EmpresaModal        from './component/modal/EmpresaModal';

import './styles/EMPRESA.css';

const cod_form = 6;

const vfilter = {
  searchText   : '',
  tipoFilter   : 'all',
  estadoFilter : 'all',
  vistaActual  : 'cards'
}

const EMPRESA = () => {
  const menuProps = Main.useMenuNavigation(cod_form);

  const [empresas           , setEmpresas           ] = React.useState([]);
  const [empresasFiltradas  , setEmpresasFiltradas  ] = React.useState([]);
  const [filters            , setFilters            ] = React.useState(vfilter);
  const [loading            , setLoading            ] = React.useState(false);
  const [currentPage        , setCurrentPage        ] = React.useState(1);
  const [pageSize           , setPageSize           ] = React.useState(10);
  const [modalVisible       , setModalVisible       ] = React.useState(false);
  const [modalMode          , setModalMode          ] = React.useState('create');
  const [empresaSeleccionada, setEmpresaSeleccionada] = React.useState(null);
  
  const {updateLogo} = useAuth();
  const message = Main.useMessage();

  // / Hook de permisos - indica las tablas que usa este formulario
  const { permisos, loading: permisosLoading, error: permisosError } = Main.usePermisos(['empresas']);

  React.useEffect(() => {
    if (permisos?.globales?.view) {
      loadEmpresas();
    }    
  }, [permisos]);

  React.useEffect(() => {
    aplicarFiltros();
    setCurrentPage(1);
  }, [filters, empresas]);

  const loadEmpresas = async () => {
    setLoading(true);
    try {
      const url_listar = MainUrl.url_listar;
      const resp = await Main.Request(url_listar, 'GET', {}); // ← await aquí
      
      if (resp.data.success) {
        setEmpresas(resp.data.data);
        setEmpresasFiltradas(resp.data.data);
      } else {
        console.error(resp.data.mensaje);
        message.error('Error al cargar empresas');
      }
    } catch (error) {
      console.error('Error cargando empresas:', error);
      message.error('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...empresas];

    if (filters.searchText) {
      // const search = filters.searchText.toLowerCase();
      const search = Main.normalize(filters.searchText);

      filtered = filtered.filter(emp =>{
        const texto = Main.normalize(
          `${emp.nombre} ${emp.ruc}`
        );
        // permite "multi keyword search"
        return search.split(" ").every(t => texto.includes(t));
      });
    }

    if (filters.tipoFilter !== 'all') {
      filtered = filtered.filter(emp => emp.tip_empresa === filters.tipoFilter);
    }

    if (filters.estadoFilter !== 'all') {
      filtered = filtered.filter(emp => emp.estado === filters.estadoFilter);
    }

    setEmpresasFiltradas(filtered);
  };

  const handleRefreshData = async () => {
    await loadEmpresas();
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // ========================================
  // HANDLERS DEL MODAL
  // ========================================
  const handleCreate = () => {
    setModalMode('create');
    setEmpresaSeleccionada(null);
    setModalVisible(true);
  };

  const handleEdit = (empresa) => {
    setModalMode('edit');
    setEmpresaSeleccionada(empresa);
    setModalVisible(true);
  };

  const handleView = (empresa) => {
    setModalMode('view');
    setEmpresaSeleccionada(empresa);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEmpresaSeleccionada(null);
  };

  const handleSave = async (formData) => {
    try {
      const form = new FormData();
      
      // AGREGAR CAMPOS DE ESTA FORMA POR QUE USALOGO
      form.append('nombre'     , formData.nombre          );
      form.append('ruc'        , formData.ruc             );
      form.append('direccion'  , formData.direccion       );
      form.append('correo'     , formData.correo          );
      form.append('nro_telef'  , formData.nro_telef       );
      form.append('tip_empresa', formData.tip_empresa     );
      form.append('modalidad'  , formData.modalidad       );
      form.append('limite_venc', formData.limit_venc || 0 );
      form.append('estado'     , formData.estado          );

      if (formData.logo) {
        form.append('logo', formData.logo);
      }

      if (modalMode === 'create') {
        const resp = await Main.Request(MainUrl.url_insert,'POST', form);
        if (resp.data.success) {
          message.success(resp.data.mensaje);          
          handleModalClose();
          await handleRefreshData();
        } else {
          message.warning(resp.data.mensaje);
          return;
        }
      } else if (modalMode === 'edit') {

        form.append('cod_empresa', empresaSeleccionada.cod_empresa);
        const resp = await Main.Request(MainUrl.url_update, 'POST', form);
        if (resp.data.success) {
          // message.success(resp.data.mensaje);
          if (resp.data.token) {
            sessionStorage.setItem('token', resp.data.token);            
            message.success('Empresa actualizada.');
            updateLogo();
          } else {
            message.success(resp.data.mensaje);
          }
          await handleRefreshData();
          handleModalClose();
        } else {
          message.warning(resp.data.mensaje);
        }
      }
    } catch (error) {
      console.error('Error guardando:', error);
      message.warning('Se produjo un error al procesar la información. Intenta nuevamente o contacta soporte.');
      throw error;
    }
  };

  const handleSaveDelete = async ( cod_empresa = false)=>{
    try {
      const resp = await Main.Request(MainUrl.url_delete,'POST',{cod_empresa});        
      if (resp.data.success) {
        message.success(resp.data.mensaje);
        await handleRefreshData();
      } else {
        message.error(resp.data.mensaje);
      }
    } catch (error) {
      console.error('Error eliminando:', error);
      message.warning('Se produjo un error al procesar la información. Intenta nuevamente o contacta soporte.');
    }
  }

  const handleExportar = async () => {
    try {
      const XLSX = await import('xlsx');
      
      message.loading('Preparando exportación...', 0);

      const datosAExportar = empresasFiltradas;

      if (datosAExportar.length === 0) {
        message.destroy();
        message.warning('No hay datos para exportar');
        return;
      }

      const datosExcel = datosAExportar.map((emp, index) => ({
        'N°'              : index + 1,
        'RUC'             : emp.ruc || '',
        'Nombre'          : emp.nombre || '',
        'Dirección'       : emp.direccion || '',
        'Correo'          : emp.correo || '',
        'Teléfono'        : emp.nro_telef || '',
        'Tipo'            : emp.tip_empresa === 'N' ? 'Nómina' : 'Beneficiario',
        'Modalidad'       : emp.modalidad === 'PRE' ? 'Prepago' : 'Postpago',
        'Días Crédito'    : emp.limit_venc || 0,
        'Estado'          : emp.estado === 'A' ? 'Activo' : 'Inactivo'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExcel);

      ws['!cols'] = [
        { wch: 5  }, { wch: 15 }, { wch: 35 }, { wch: 40 }, { wch: 30 },
        { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 10 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Empresas');

      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Empresas_${fecha}.xlsx`;

      XLSX.writeFile(wb, nombreArchivo);

      message.destroy();
      message.success(`${datosAExportar.length} registro(s) exportado(s) exitosamente`);

    } catch (error) {
      message.destroy();
      console.error('Error exportando a Excel:', error);
      message.error('Error al exportar. Verifica que la librería xlsx esté instalada.');
    }
  };

  // ========================================
  // CALCULAR DATOS PAGINADOS
  // ========================================
  const startIndex        = (currentPage - 1) * pageSize;
  const endIndex          = startIndex + pageSize;
  const empresasPaginadas = empresasFiltradas.slice(startIndex, endIndex);

  return (
  <Main.MainLayout {...menuProps}>
    {
      permisosLoading ? (
        <>
          <Main.EmpresaSkeleton />
        </>
      ) : permisosError ? (
        <Main.SinAcceso 
          titulo  = "Error al Verificar Permisos"
          mensaje = "Ocurrió un error al verificar tus permisos. Por favor, intenta recargar la página."
        />
      ) : !permisos?.globales?.view ? (
        <Main.SinAcceso 
          titulo="Acceso Denegado"
          mensaje="No tienes permisos para ver el módulo de Empresas"
        />
      ) : (
        <>
          <div style={{paddingBottom: empresasFiltradas.length >= pageSize ? '60px' : '0px'}}>

            <EmpresaHeader 
              totalEmpresas = { empresas.length   } 
              onRefreshData = { handleRefreshData }
              onCreate      = { handleCreate      }
              permisos      = { permisos.globales }
              handleExportar= { handleExportar    }
            />
            
            <EmpresasToolbar 
              onFiltersChange={handleFiltersChange}
            />

            {filters.vistaActual === 'cards' ? (
              
              <EmpresasCards 
                empresas    = { empresasPaginadas } 
                loading     = { permisosLoading || loading}
                onView      = { handleView        }
                onEdit      = { handleEdit        }
                permisos    = { permisos.globales } 
                saveDelete  = { handleSaveDelete  }
              />

            ) : (

              <EmpresasTable 
                empresas  = { empresasPaginadas }
                loading   = { permisosLoading || loading}
                onView    = { handleView        }
                onEdit    = { handleEdit        }
                permisos  = { permisos.globales }
                saveDelete= { handleSaveDelete  }
              />

            )}
          </div>

          <Main.Pages
            currentPage      = { currentPage              }
            pageSize         = { pageSize                 }
            total            = { empresasFiltradas.length }
            onPageChange     = { handlePageChange         }
            onPageSizeChange = { handlePageSizeChange     }
          />

          <EmpresaModal
            visible  = { modalVisible        }
            mode     = { modalMode           }
            empresa  = { empresaSeleccionada }
            onClose  = { handleModalClose    }
            onSave   = { handleSave          }
            permisos = { permisos.globales   } 
          />
        </>
      )
    }
  </Main.MainLayout>
  );
};

export default EMPRESA;