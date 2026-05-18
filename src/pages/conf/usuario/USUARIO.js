import * as React from 'react';
import Main from '../../../util/main';
import MainUrl from './url/mainUrl';
import { useAuth } from '../../../context/AuthContext';
// COMPONENT
import UsuarioHeader from './component/header/UsuarioHeader';
import UsuarioToolBar from './component/toolBar/UsuarioToolBar';
import UsuarioCards from './component/cards/UsuarioCards';
import UsuarioTable from './component/table/UsuarioTable';
import UsuarioModal from './component/modal/UsuarioModal';
import MainLayout from '../../../components/layout/MainLayout';
import MainIcon from '../../../util/mainIcon';

const cod_form = 14;

const vfilter = {
    searchText: '',
    estadoFilter: 'all',
    vistaActual: 'cards'
};

const USUARIO = () => {

    const menuProps = Main.useMenuNavigation(cod_form);
    const { empresa } = useAuth();

    const [usuarios, setUsuarios] = React.useState([]);
    const [usuariosFiltrados, setUsuariosFiltradas] = React.useState([]);
    const [filters, setFilters] = React.useState(vfilter);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);

    // Estados del modal
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalMode, setModalMode] = React.useState('create');
    const [selectedPersona, setSelectedPersona] = React.useState(null);

    const message = Main.useMessage();

    // Hook de permisos
    const { permisos, loading: permisosLoading, error: permisosError } = Main.usePermisos(['personas', 'roles', 'roles_menu_espec']);

    React.useEffect(() => {
        if (permisos?.globales?.view) {
            loadUsuarios();
        }
    }, [permisos, empresa]);

    React.useEffect(() => {
        aplicarFiltros();
        setCurrentPage(1);
    }, [filters, usuarios]);

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const loadUsuarios = async () => {
        setLoading(true);
        try {
            const url_listar = MainUrl.url_listar;
            const resp = await Main.Request(url_listar, 'GET', {});

            if (resp.data.success) {
                setUsuarios(resp.data.data);
                setUsuariosFiltradas(resp.data.data);
            } else {
                message.error('Error al cargar usuarios');
            }
        } catch (error) {
            console.error('Error cargando usuarios:', error);
            message.error('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let filtered = [...usuarios];

        if (filters.searchText) {
            const search = Main.normalize(filters.searchText);
            filtered = filtered.filter(per => {
                const texto = Main.normalize(
                    `${per.descripcion} ${per.usuario_pg || ''} ${per.nro_documento || ''}`
                );
                return search.split(" ").every(t => texto.includes(t));
            });
        }


        if (filters.estadoFilter !== "all") {
            filtered = filtered.filter(per => per.estado === filters.estadoFilter);
        }

        setUsuariosFiltradas(filtered);
    };

    const handleRefreshData = async () => {
        await loadUsuarios();
    };

    const handleCreate = () => {
        // Para usuarios, "Crear" significa asignar acceso a una persona que no tiene usuario_pg
        // El modal de búsqueda de personas se manejará dentro de UsuarioModal
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
        setModalMode(persona.usuario_pg ? 'edit' : 'create');
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

    const handleSave = async (formData) => {
        try {
            let resp;
            if (modalMode === 'create') {
                resp = await Main.Request(MainUrl.url_insert, 'POST', formData, message);
            } else if (modalMode === 'edit') {
                resp = await Main.Request(MainUrl.url_update, 'POST', formData, message);
            }

            if (resp && resp.data.success) {
                message.success(resp.data.message);
                await handleRefreshData();
                return resp.data;
            } else {
                throw new Error(resp?.data?.message || 'Error al guardar');
            }
        } catch (error) {
            console.error('Error guardando usuario:', error);
            throw error;
        }
    };

    const handleDelete = async (usuario) => {
        Main.Modal.confirm({
            title: '¿Quitar acceso de usuario?',
            icon: <MainIcon.ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            content: (
                <div>
                    <p>Esta acción desasociará el acceso del usuario <strong>{usuario.usuario_pg}</strong> de esta persona en la empresa actual.</p>
                    <p style={{ color: '#ff4d4f', fontWeight: 600 }}>¿Está seguro de que desea continuar?</p>
                </div>
            ),
            okText: 'Sí, Quitar Acceso',
            okType: 'danger',
            cancelText: 'Cancelar',
            centered: true,
            onOk: async () => {
                try {
                    const resp = await Main.Request(MainUrl.url_delete, 'POST', { cod_persona: usuario.cod_persona });
                    if (resp.data.success) {
                        message.success(resp.data.message);
                        await handleRefreshData();
                    } else {
                        message.error(resp.data.message);
                    }
                } catch (error) {
                    console.error('Error eliminando acceso:', error);
                    message.error('Ocurrió un error al intentar quitar el acceso');
                }
            }
        });
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const usuariosPaginados = usuariosFiltrados.slice(startIndex, endIndex);

    return (
        <MainLayout {...menuProps}>

            {permisosLoading ? (
                <Main.PersonaSkeleton />
            ) : permisosError ? (
                <Main.SinAcceso
                    titulo="Error al Verificar Permisos"
                    mensaje="Ocurrió un error al verificar tus permisos."
                />
            ) : !permisos?.globales?.view ? (
                <Main.SinAcceso
                    titulo="Acceso Denegado"
                    mensaje="No tienes permisos para ver el módulo de Usuarios"
                />
            ) : (
                <>
                    <div style={{ paddingBottom: usuariosFiltrados.length >= pageSize ? '60px' : '0px' }}>
                        <UsuarioHeader
                            totalUsuarios={usuarios.length}
                            onRefreshData={handleRefreshData}
                            onCreate={handleCreate}
                            permisos={permisos.porTabla.personas}
                        // handleExportar = { handleExportar             }
                        />

                        <UsuarioToolBar
                            onFiltersChange={handleFiltersChange}
                        />

                        {filters.vistaActual === 'cards' ? (
                            <UsuarioCards
                                usuarios={usuariosPaginados}
                                loading={loading}
                                permisos={permisos.porTabla.personas}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ) : (
                            <UsuarioTable
                                usuarios={usuariosPaginados}
                                loading={loading}
                                permisos={permisos.porTabla.personas}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>

                    <Main.Pages
                        currentPage={currentPage}
                        pageSize={pageSize}
                        total={usuariosFiltrados.length}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />

                    <UsuarioModal
                        visible={modalVisible}
                        mode={modalMode}
                        persona={selectedPersona}
                        onClose={handleModalClose}
                        onSave={handleSave}
                        permisos={permisos}
                    />
                </>
            )}
        </MainLayout>
    );
};

export default USUARIO;
