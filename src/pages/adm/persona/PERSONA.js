import * as React from 'react';
import Main from '../../../util/main';
import MainUrl from './url/mainUrl';
import { useAuth } from '../../../context/AuthContext';
// COMPONENT
import PersonaHeader  from './component/header/PersonaHeader';
import PersonaToolBar from './component/toolBar/PersonaToolBar';
import PersonaCards   from './component/cards/PersonaCards';
import PersonaTable   from './component/table/PersonaTable';
import PersonaModal   from './component/modal/PersonaModal';
import MainLayout from '../../../components/layout/MainLayout';
const cod_form = 5;

const vfilter = {
  searchText: '',
  tipoFilter: 'all',
  estadoFilter: 'all',
  vistaActual: 'cards'
};

const PERSONA = () => {

  const menuProps = Main.useMenuNavigation(cod_form);
  const { empresa } = useAuth();

  const [ personas          , setPersonas          ] = React.useState([]);
  const [ personasFiltradas , setPersonasFiltradas ] = React.useState([]);
  const [ filters           , setFilters           ] = React.useState(vfilter);
  const [ loading           , setLoading           ] = React.useState(false);
  const [ currentPage       , setCurrentPage       ] = React.useState(1);
  const [ pageSize          , setPageSize          ] = React.useState(10);
  // Estados del modal
  const [ modalVisible      , setModalVisible      ] = React.useState(false);
  const [ modalMode         , setModalMode         ] = React.useState('create');
  const [ selectedPersona   , setSelectedPersona   ] = React.useState(null);

  const message = Main.useMessage();

  // Hook de permisos
  const { permisos, loading: permisosLoading, error: permisosError } = Main.usePermisos(['personas', 'roles', 'roles_menu_espec']);

  React.useEffect(() => {
    if (permisos?.globales?.view) {
      loadPersonas();
    }
  }, [permisos, empresa]);

  React.useEffect(() => {
    aplicarFiltros();
    setCurrentPage(1);
  }, [filters, personas]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const loadPersonas = async () => {
    setLoading(true);
    try {
      const url_listar = MainUrl.url_listar;
      const resp = await Main.Request(url_listar, 'GET', {});

      if (resp.data.success) {
        setPersonas(resp.data.data);
        setPersonasFiltradas(resp.data.data);
      } else {
        console.error(resp.data.message);
        message.error('Error al cargar personas');
      }
    } catch (error) {
      console.error('Error cargando personas:', error);
      message.error('Error al cargar personas');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...personas];

    // --- Filtro de texto ---
    if (filters.searchText) {
      const search = Main.normalize(filters.searchText);

      filtered = filtered.filter(per => {
        const texto = Main.normalize(
          `${per.descripcion} ${per.usuario_pg} ${per.nro_documento}`
        );

        // permite "multi keyword search"
        return search.split(" ").every(t => texto.includes(t));
      });
    }

    // --- Filtro por tipo ---
    if (filters.tipoFilter !== "all") {
      filtered = filtered.filter(per => per.rol_principal === filters.tipoFilter);
    }

    // --- Filtro por estado ---
    if (filters.estadoFilter !== "all") {
      filtered = filtered.filter(per => per.estado === filters.estadoFilter);
    }

    setPersonasFiltradas(filtered);
  };

  const handleRefreshData = async () => {
    await loadPersonas();
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedPersona(null);
    setModalVisible(true);
  };

  const handleView = (persona) => {
    setModalMode('view');
    setSelectedPersona(persona);
    setModalVisible(true);
  };

  const handleEdit = (persona) => {
    setModalMode('edit');
    setSelectedPersona(persona);
    setModalVisible(true);
  }

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedPersona(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportar = async () => {
    try {

      const autoFitColumns = (data) => {
        const keys = Object.keys(data[0]);
        return keys.map(key => {
          const maxLength = Math.max(
            key.length,
            ...data.map(row => String(row[key] ?? '').length)
          );
          return { wch: maxLength + 2 }; // +2 para margen
        });
      };

      const XLSX = await import('xlsx');

      message.loading('Preparando exportación...', 0);

      const datosAExportar = personasFiltradas;

      if (datosAExportar.length === 0) {
        message.destroy();
        message.warning('No hay datos para exportar');
        return;
      }

      const datosExcel = datosAExportar.map((emp, index) => ({
        N: index + 1,
        ...emp
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExcel);

      ws['!cols'] = autoFitColumns(datosExcel);

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

  const handleSave = async (formData) => {
    try {
      // Preparar datos para enviar
      const dataToSend = {
        descripcion       : formData.descripcion,
        usuario_pg        : formData.usuario_pg,
        nro_documento     : formData.nro_documento,
        nro_telef         : formData.nro_telef,
        correo            : formData.correo,
        cod_empresa       : formData.cod_empresa,
        rol_principal     : formData.rol_principal,
        roles_adicionales : formData.roles_adicionales || [],
        menus_por_rol     : formData.menus_por_rol     || {},
        estado            : formData.estado
      };

      // Incluir contraseña y flag temporal si están presentes
      if (formData.password && formData.password.trim() !== '') {
        dataToSend.password = formData.password;
        dataToSend.es_password_temporal = formData.es_password_temporal ? 'S' : 'N';
      }

      let resp;

      if (modalMode === 'create') {
        // CREAR NUEVA PERSONA
        resp = await Main.Request(MainUrl.url_insert, 'POST', dataToSend, message);
        
        if (resp && resp.data.success) {
          message.success(resp.data.message);
          await handleRefreshData();
          return resp.data;  // Retornar data completo
        }
        
      } else if (modalMode === 'edit') {
        // ACTUALIZAR PERSONA EXISTENTE
        dataToSend.cod_persona = selectedPersona.cod_persona;
        resp = await Main.Request(MainUrl.url_update, 'POST', dataToSend, message);
        
        if (resp && resp.data.success) {
          message.success(resp.data.message);
          await handleRefreshData();
          return resp.data;  // Retornar data completo
        }
      }

      if (resp && !resp.data.success) {
        throw new Error(resp?.data?.message || 'Error al guardar');
      }

    } catch (error) {
      console.error('Error guardando persona:', error);
      throw error;
    }
  };

  const handleDelete = async (cod_persona = false) => {
    try {
      if (!cod_persona) {
        message.error('Código de persona requerido');
        return;
      }

      const resp = await Main.Request(MainUrl.url_delete, 'POST', { cod_persona });

      if (resp.data.success) {
        message.success(resp.data.message);
        await handleRefreshData();
      } else {
        message.error(resp.data.message);
      }

    } catch (error) {
      console.error('Error eliminando persona:', error);
    }
  }


  // ========================================
  // CALCULAR DATOS PAGINADOS
  // ========================================
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex   = startIndex + pageSize;
  const personasPaginadas = personasFiltradas.slice(startIndex, endIndex);

  return (
    <MainLayout {...menuProps}>

      {permisosLoading ? (
        <>
          <Main.PersonaSkeleton />
        </>
      ) : permisosError ? (
        <Main.SinAcceso
          titulo="Error al Verificar Permisos"
          mensaje="Ocurrió un error al verificar tus permisos. Por favor, intenta recargar la página."
        />
      ) : !permisos?.globales?.view ? (
        <Main.SinAcceso
          titulo="Acceso Denegado"
          mensaje="No tienes permisos para ver el módulo de Personas"
        />
      ) : (
        <>
          <div style={{ paddingBottom: personasFiltradas.length >= pageSize ? '60px' : '0px' }}>
            <PersonaHeader
              totalPersonas  = { personas.length            }
              onRefreshData  = { handleRefreshData          }
              onCreate       = { handleCreate               }
              permisos       = { permisos.porTabla.personas }
              handleExportar = { handleExportar             }
            />

            <PersonaToolBar
              onFiltersChange={handleFiltersChange}
            />

            {filters.vistaActual === 'cards' ? (
              <PersonaCards
                personas   = { personasPaginadas          }
                loading    = { loading                    }
                permisos   = { permisos.porTabla.personas }
                onView     = { handleView                 }
                onEdit     = { handleEdit                 }
                saveDelete = { handleDelete               }
              />
            ) : (
              <PersonaTable
                personas   = { personasPaginadas          }
                loading    = { loading                    }
                permisos   = { permisos.porTabla.personas }
                onView     = { handleView                 }
                onEdit     = { handleEdit                 }
                saveDelete = { handleDelete               }
              />
            )}
          </div>

          <Main.Pages
            currentPage      = { currentPage              }
            pageSize         = { pageSize                 }
            total            = { personasFiltradas.length }
            onPageChange     = { handlePageChange         }
            onPageSizeChange = { handlePageSizeChange     }
          />

          {/* MODAL */}
          <PersonaModal
            visible  = { modalVisible     }
            mode     = { modalMode        }
            persona  = { selectedPersona  }
            onClose  = { handleModalClose }
            onSave   = { handleSave       }
            permisos = { permisos         }
          />

        </>
      )}
    </MainLayout>
  );
};

export default PERSONA;





// import React from 'react';
// import Main from '../../../util/main';
// import MainUrl from './url/mainUrl';
// import { useAuth } from '../../../context/AuthContext';
// // COMPONENT
// import PersonaHeader from './component/header/PersonaHeader';
// import PersonaToolBar from './component/toolBar/PersonaToolBar';
// import PersonaCards from './component/cards/PersonaCards';
// import PersonaTable from './component/table/PersonaTable';
// import PersonaModal from './component/modal/PersonaModal';
// const cod_form = 5;

// const vfilter = {
//   searchText: '',
//   tipoFilter: 'all',
//   estadoFilter: 'all',
//   vistaActual: 'cards'
// };

// // Agregar en PERSONA.js después de las constantes
// const personasEjemplo = Array.from({ length: 21 }, (_, i) => {
//   const nombres = ['Juan', 'María', 'Pedro', 'Ana', 'Carlos', 'Lucía', 'Jorge', 'Laura', 'Diego', 'Sofía'];
//   const apellidos = ['González', 'Martínez', 'López', 'Rodríguez', 'Pérez', 'García', 'Fernández', 'Silva', 'Torres', 'Benítez'];

//   const nombre = nombres[i % nombres.length];
//   const apellido = apellidos[Math.floor(i / nombres.length) % apellidos.length];
//   const roles = ['rol_super_adm', 'rol_adm', 'rol_cliente', 'rol_usuario', 'rol_consulta'];

//   return {
//     usuario_pg: `${nombre.toLowerCase()}${apellido.toLowerCase()}${i}`,
//     cod_empresa: (i % 3) + 1,
//     cod_persona: i + 1 + '+' + i,
//     descripcion: `${nombre} ${apellido} ${i}`,
//     nro_documento: `${String(1000000 + i).padStart(7, '0')}-${(i % 9) + 1}`,
//     nro_telef: `098${String(i).padStart(7, '0')}`,
//     correo: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@boxcard.com`,
//     estado: i % 5 === 0 ? 'I' : 'A',
//     rol_principal: roles[i % roles.length],
//     empresa_nombre: `Empresa ${(i % 3) + 1}`,
//   };
// });

// const PERSONA = () => {

//   const menuProps = Main.useMenuNavigation(cod_form);
//   const { empresa } = useAuth();

//   const [ personas          , setPersonas          ] = React.useState([]);
//   const [ personasFiltradas , setPersonasFiltradas ] = React.useState([]);
//   const [ filters           , setFilters           ] = React.useState(vfilter);
//   const [ loading           , setLoading           ] = React.useState(false);
//   const [ currentPage       , setCurrentPage       ] = React.useState(1);
//   const [ pageSize          , setPageSize          ] = React.useState(10);
//   // Estados del modal
//   const [ modalVisible      , setModalVisible      ] = React.useState(false);
//   const [ modalMode         , setModalMode         ] = React.useState('create');
//   const [ selectedPersona   , setSelectedPersona   ] = React.useState(null);

//   const message = Main.useMessage();

//   // Hook de permisos
//   const { permisos, loading: permisosLoading, error: permisosError } = Main.usePermisos(['personas', 'roles', 'roles_menu_espec']);

//   React.useEffect(() => {
//     if (permisos?.globales?.view) {
//       loadPersonas();
//     }
//   }, [permisos, empresa]);

//   React.useEffect(() => {
//     aplicarFiltros();
//     setCurrentPage(1);
//   }, [filters, personas]);

//   const handleFiltersChange = (newFilters) => {
//     setFilters(newFilters);
//   };

//   const loadPersonas = async () => {
//     setLoading(true);
//     try {
//       const url_listar = MainUrl.url_listar;
//       const resp = await Main.Request(url_listar, 'GET', {});

//       if (resp.data.success) {
//         setPersonas(resp.data.data);
//         setPersonasFiltradas(resp.data.data);
//       } else {
//         console.error(resp.data.message);
//         message.error('Error al cargar personas');
//       }
//     } catch (error) {
//       console.error('Error cargando personas:', error);
//       message.error('Error al cargar personas');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const aplicarFiltros = () => {
//     let filtered = [...personas];

//     // --- Filtro de texto ---
//     if (filters.searchText) {
//       const search = Main.normalize(filters.searchText);

//       filtered = filtered.filter(per => {
//         const texto = Main.normalize(
//           `${per.descripcion} ${per.usuario_pg} ${per.nro_documento}`
//         );

//         // permite "multi keyword search"
//         return search.split(" ").every(t => texto.includes(t));
//       });
//     }

//     // --- Filtro por tipo ---
//     if (filters.tipoFilter !== "all") {
//       filtered = filtered.filter(per => per.rol_principal === filters.tipoFilter);
//     }

//     // --- Filtro por estado ---
//     if (filters.estadoFilter !== "all") {
//       filtered = filtered.filter(per => per.estado === filters.estadoFilter);
//     }

//     setPersonasFiltradas(filtered);
//   };

//   const handleRefreshData = async () => {
//     await loadPersonas();
//   };

//   const handleCreate = () => {
//     setModalMode('create');
//     setSelectedPersona(null);
//     setModalVisible(true);
//   };

//   const handleView = (persona) => {
//     setModalMode('view');
//     setSelectedPersona(persona);
//     setModalVisible(true);
//   };

//   const handleEdit = (persona) => {
//     setModalMode('edit');
//     setSelectedPersona(persona);
//     setModalVisible(true);
//   }

//   const handleModalClose = () => {
//     setModalVisible(false);
//     setSelectedPersona(null);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handlePageSizeChange = (newPageSize) => {
//     setPageSize(newPageSize);
//     setCurrentPage(1);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleExportar = async () => {
//     try {

//       const autoFitColumns = (data) => {
//         const keys = Object.keys(data[0]);
//         return keys.map(key => {
//           const maxLength = Math.max(
//             key.length,
//             ...data.map(row => String(row[key] ?? '').length)
//           );
//           return { wch: maxLength + 2 }; // +2 para margen
//         });
//       };

//       const XLSX = await import('xlsx');

//       message.loading('Preparando exportación...', 0);

//       const datosAExportar = personasFiltradas;

//       if (datosAExportar.length === 0) {
//         message.destroy();
//         message.warning('No hay datos para exportar');
//         return;
//       }

//       const datosExcel = datosAExportar.map((emp, index) => ({
//         N: index + 1,
//         ...emp
//       }));

//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.json_to_sheet(datosExcel);

//       ws['!cols'] = autoFitColumns(datosExcel);

//       XLSX.utils.book_append_sheet(wb, ws, 'Empresas');

//       const fecha = new Date().toISOString().split('T')[0];
//       const nombreArchivo = `Empresas_${fecha}.xlsx`;

//       XLSX.writeFile(wb, nombreArchivo);

//       message.destroy();
//       message.success(`${datosAExportar.length} registro(s) exportado(s) exitosamente`);

//     } catch (error) {
//       message.destroy();
//       console.error('Error exportando a Excel:', error);
//       message.error('Error al exportar. Verifica que la librería xlsx esté instalada.');
//     }
//   };

//   const handleSave = async (formData) => {
//     try {
//       // Preparar datos para enviar
//       const dataToSend = {
//         descripcion       : formData.descripcion,
//         usuario_pg        : formData.usuario_pg,
//         nro_documento     : formData.nro_documento,
//         nro_telef         : formData.nro_telef,
//         correo            : formData.correo,
//         cod_empresa       : formData.cod_empresa,
//         rol_principal     : formData.rol_principal,
//         roles_adicionales : formData.roles_adicionales || [],
//         menus_por_rol     : formData.menus_por_rol     || {},
//         estado            : formData.estado
//       };

//       // Incluir contraseña y flag temporal si están presentes
//       if (formData.password && formData.password.trim() !== '') {
//         dataToSend.password = formData.password;
//         dataToSend.es_password_temporal = formData.es_password_temporal || false;
//       }

//       let resp;

//       if (modalMode === 'create') {
//         // CREAR NUEVA PERSONA
//         resp = await Main.Request(MainUrl.url_insert, 'POST', dataToSend, message);
        
//         if (resp && resp.data.success) {
//           message.success(resp.data.message);
//           await handleRefreshData();
//           return resp.data;  // Retornar data completo
//         }
        
//       } else if (modalMode === 'edit') {
//         // ACTUALIZAR PERSONA EXISTENTE
//         dataToSend.cod_persona = selectedPersona.cod_persona;
//         resp = await Main.Request(MainUrl.url_update, 'POST', dataToSend, message);
        
//         if (resp && resp.data.success) {
//           message.success(resp.data.message);
//           await handleRefreshData();
//           return resp.data;  // Retornar data completo
//         }
//       }

//       if (resp && !resp.data.success) {
//         message.warning(resp?.data?.message || 'Error desconocido');
//         throw new Error(resp?.data?.message || 'Error al guardar');
//       }

//     } catch (error) {
//       console.error('Error guardando persona:', error);
//       throw error;
//     }
//   };

//   const handleDelete = async (cod_persona = false) => {
//     try {
//       if (!cod_persona) {
//         message.error('Código de persona requerido');
//         return;
//       }

//       const resp = await Main.Request(MainUrl.url_delete, 'POST', { cod_persona });

//       if (resp.data.success) {
//         message.success(resp.data.message);
//         await handleRefreshData();
//       } else {
//         message.error(resp.data.message);
//       }

//     } catch (error) {
//       console.error('Error eliminando persona:', error);
//     }
//   }


//   // ========================================
//   // CALCULAR DATOS PAGINADOS
//   // ========================================
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex   = startIndex + pageSize;
//   const personasPaginadas = personasFiltradas.slice(startIndex, endIndex);

//   return (
//     <MainLayout {...menuProps}>

//       {permisosLoading ? (
//         <>
//           <Main.PersonaSkeleton />
//         </>
//       ) : permisosError ? (
//         <Main.SinAcceso
//           titulo="Error al Verificar Permisos"
//           mensaje="Ocurrió un error al verificar tus permisos. Por favor, intenta recargar la página."
//         />
//       ) : !permisos?.globales?.view ? (
//         <Main.SinAcceso
//           titulo="Acceso Denegado"
//           mensaje="No tienes permisos para ver el módulo de Personas"
//         />
//       ) : (
//         <>
//           <div style={{ paddingBottom: personasFiltradas.length >= pageSize ? '60px' : '0px' }}>
//             <PersonaHeader
//               totalPersonas  = { personas.length            }
//               onRefreshData  = { handleRefreshData          }
//               onCreate       = { handleCreate               }
//               permisos       = { permisos.porTabla.personas }
//               handleExportar = { handleExportar             }
//             />

//             <PersonaToolBar
//               onFiltersChange={handleFiltersChange}
//             />

//             {filters.vistaActual === 'cards' ? (
//               <PersonaCards
//                 personas   = { personasPaginadas          }
//                 loading    = { loading                    }
//                 permisos   = { permisos.porTabla.personas }
//                 onView     = { handleView                 }
//                 onEdit     = { handleEdit                 }
//                 saveDelete = { handleDelete               }
//               />
//             ) : (
//               <PersonaTable
//                 personas   = { personasPaginadas          }
//                 loading    = { loading                    }
//                 permisos   = { permisos.porTabla.personas }
//                 onView     = { handleView                 }
//                 onEdit     = { handleEdit                 }
//                 saveDelete = { handleDelete               }
//               />
//             )}
//           </div>

//           <Main.Pages
//             currentPage      = { currentPage              }
//             pageSize         = { pageSize                 }
//             total            = { personasFiltradas.length }
//             onPageChange     = { handlePageChange         }
//             onPageSizeChange = { handlePageSizeChange     }
//           />

//           {/* MODAL */}
//           <PersonaModal
//             visible  = { modalVisible     }
//             mode     = { modalMode        }
//             persona  = { selectedPersona  }
//             onClose  = { handleModalClose }
//             onSave   = { handleSave       }
//             permisos = { permisos         }
//           />

//         </>
//       )}
//     </MainLayout>
//   );
// };

// export default PERSONA;-