import * as React from 'react';
import Main from '../../../util/main';
import MainIcon from '../../../util/mainIcon';
import SolicitudCards from './component/cards/SolicitudCards';
import SolicitudHeader from './component/header/SolicitudHeader';
import SolicitudToolbar from './component/toolbar/SolicitudToolbar';
import SolicitudModalView from './component/modal/SolicitudModalView';
import MainLayout from '../../../components/layout/MainLayout';
import { formatCurrency } from './data/solicitudesMock';
import MainUrl from './url/mainUrl';
import './styles/SOLICITUD.css';

const cod_form = 2;

const SOLICITUD = () => {
    const menuProps = Main.useMenuNavigation(cod_form);
    const message = Main.useMessage();

    const [solicitudes, setSolicitudes] = React.useState([]);
    const [solicitudesFiltradas, setSolicitudesFiltradas] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalMode, setModalMode] = React.useState('view');
    const [selectedSolicitud, setSelectedSolicitud] = React.useState(null);

    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(12);
    const [filters, setFilters] = React.useState({ searchText: '', estadoFilter: 'all' });
    const [form] = Main.Form.useForm();

    // Hook de permisos
    const { permisos, loading: permisosLoading, error: permisosError } = Main.usePermisos(['solicitudes_carga']);

    const loadSolicitudes = async () => {
        setLoading(true);
        try {
            const resp = await Main.Request(MainUrl.url_listar, 'GET');
            if (resp.data.success) {
                setSolicitudes(resp.data.data);
                setSolicitudesFiltradas(resp.data.data);
            } else {
                message.error(resp.data.mensaje || resp.data.message);
            }
        } catch (error) {
            message.error('Error al cargar solicitudes');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (permisos?.globales?.view) {
            loadSolicitudes();
        }
    }, [permisos]);

    // Filtrar solicitudes localmente
    React.useEffect(() => {
        let filtered = [...solicitudes];

        if (filters.estadoFilter && filters.estadoFilter !== 'all') {
            filtered = filtered.filter(s => s.estado === filters.estadoFilter);
        }

        if (filters.searchText) {
            const search = Main.normalize(filters.searchText.toLowerCase());
            filtered = filtered.filter(s => {
                const nombreEmpresa = Main.normalize((s.nombre_empresa || '').toLowerCase());
                const solicitante = Main.normalize((s.solicitante_nombre || s.solicitante_username || '').toLowerCase());
                const nroSol = String(s.nro_solicitud);
                const nombreDestino = Main.normalize((s.nombre_empresa_destino || '').toLowerCase());

                return nombreEmpresa.includes(search) ||
                    solicitante.includes(search) ||
                    nroSol.includes(search) ||
                    nombreDestino.includes(search);
            });
        }
        setSolicitudesFiltradas(filtered);
        setCurrentPage(1); // Reiniciar paginación al filtrar
    }, [filters, solicitudes]);

    const handleFiltersChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleView = (record) => {
        setSelectedSolicitud(record);
        setModalMode('view');
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedSolicitud(record);
        setModalMode('edit');
        setModalVisible(true);
    };

    const handleCreate = () => {
        setSelectedSolicitud(null);
        setModalMode('create');
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedSolicitud(null);
    };

    // ─── Guardar (crear o editar) ───────────────────────────────
    const handleSubmit = async (payload) => {
        try {
            setLoading(true);
            const isCreate = modalMode === 'create';
            const url = isCreate ? MainUrl.url_insert : MainUrl.url_update;
            if (!isCreate) payload.cod_solicitud = selectedSolicitud.cod_solicitud;

            const resp = await Main.Request(url, 'POST', payload);
            if (resp.data.success) {
                message.success(resp.data.mensaje || resp.data.message);
                handleCloseModal();
                loadSolicitudes();
            } else {
                message.error(resp.data.mensaje || resp.data.message);
            }
        } catch (error) {
            message.error('Error al guardar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    // ─── Enviar a aprobación (BORRADOR → PENDIENTE) ─────────────
    const handleSend = async (cod_solicitud) => {
        try {
            const resp = await Main.Request(MainUrl.url_enviar, 'POST', { cod_solicitud });
            if (resp.data.success) {
                message.success(resp.data.mensaje || resp.data.message);
                handleCloseModal();
                loadSolicitudes();
            } else {
                message.error(resp.data.mensaje || resp.data.message);
            }
        } catch (error) {
            message.error('Error al enviar la solicitud');
        }
    };

    // ─── Rechazar (PENDIENTE → RECHAZADA) ───────────────────────
    const handleReject = (record) => {
        let motivo = '';
        Main.Modal.confirm({
            title: 'Rechazar Solicitud',
            icon: <MainIcon.CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
            content: (
                <div>
                    <p>¿Desea rechazar la solicitud <b>SOL-{record.nro_solicitud}</b>?</p>
                    <Main.Input.TextArea
                        rows={3}
                        placeholder="Motivo del rechazo (opcional)"
                        onChange={(e) => { motivo = e.target.value; }}
                    />
                </div>
            ),
            okText: 'Rechazar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    const resp = await Main.Request(MainUrl.url_rechazar, 'POST', {
                        cod_solicitud: record.cod_solicitud,
                        motivo_rechazo: motivo
                    });
                    if (resp.data.success) {
                        message.success(resp.data.mensaje || resp.data.message);
                        handleCloseModal();
                        loadSolicitudes();
                    } else {
                        message.error(resp.data.mensaje || resp.data.message);
                    }
                } catch (error) {
                    message.error('Error al rechazar solicitud');
                }
            }
        });
    };

    // ─── Eliminar o Anular ──────────────────────────────────────
    const handleDelete = (record) => {
        const isBorrador = record.estado === 'B';
        let motivo = '';

        Main.Modal.confirm({
            title: isBorrador ? '¿Eliminar solicitud?' : 'Anular Solicitud Enviada',
            icon: isBorrador ? <MainIcon.DeleteOutlined /> : <MainIcon.WarningOutlined style={{ color: '#faad14' }} />,
            content: (
                <div>
                    <p>
                        {isBorrador
                            ? `¿Está seguro de eliminar permanentemente la solicitud SOL-${record.nro_solicitud}?`
                            : `¿Está seguro de anular la solicitud ${'SOL-' + record.nro_solicitud}?`
                        }
                    </p>
                    {!isBorrador && (
                        <Main.Input.TextArea
                            rows={3}
                            placeholder="Indique el motivo de la anulación (obligatorio)"
                            onChange={(e) => { motivo = e.target.value; }}
                        />
                    )}
                </div>
            ),
            okText: isBorrador ? 'Eliminar' : 'Anular Solicitud',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                if (!isBorrador && !motivo.trim()) {
                    message.warning('Debe ingresar un motivo para anular la solicitud');
                    return Promise.reject();
                }

                try {
                    const resp = await Main.Request(MainUrl.url_delete, 'POST', {
                        cod_solicitud: record.cod_solicitud,
                        motivo_anulacion: motivo
                    });
                    if (resp.data.success) {
                        message.success(resp.data.mensaje || resp.data.message);
                        loadSolicitudes();
                    } else {
                        message.error(resp.data.mensaje || resp.data.message);
                    }
                } catch (error) {
                    message.error('Error al procesar la solicitud');
                }
            },
        });
    };


    // ─── Estadísticas ────────────────────────────────────────────
    const stats = React.useMemo(() => {
        const confirmadas = solicitudesFiltradas.filter(s => s.estado === 'C');
        return {
            total: solicitudesFiltradas.length,
            borrador: solicitudesFiltradas.filter(s => s.estado === 'B').length,
            pendiente: solicitudesFiltradas.filter(s => s.estado === 'P').length,
            confirmada: confirmadas.length,
            rechazada: solicitudesFiltradas.filter(s => s.estado === 'R').length,
            montoTotal: confirmadas.reduce((sum, s) => sum + (Number(s.monto_solicitado) || 0), 0),
        };
    }, [solicitudesFiltradas]);

    // ========================================
    // PAGINACIÓN
    // ========================================
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    return (
        <MainLayout {...menuProps}>
            {permisosLoading ? (
                <Main.SolicitudSkeleton />
            ) : permisosError ? (
                <Main.SinAcceso
                    titulo="Error al Verificar Permisos"
                    mensaje="Ocurrió un error al verificar tus permisos. Por favor, intenta recargar la página."
                />
            ) : !permisos?.globales?.view ? (
                <Main.SinAcceso
                    titulo="Acceso Denegado"
                    mensaje="No tienes permisos para ver el módulo de Solicitudes de Carga"
                />
            ) : (
                <>
                    <div style={{ padding: '24px', paddingBottom: solicitudes.length >= pageSize ? '60px' : '24px' }}>
                        <SolicitudHeader
                            totalSolicitudes={stats.total}
                            stats={stats}
                            filters={filters}
                            onRefreshData={loadSolicitudes}
                            onCreate={handleCreate}
                            loading={loading}
                        />

                        <SolicitudToolbar
                            onFiltersChange={handleFiltersChange}
                        />

                        {/* CARDS GRID */}
                        <SolicitudCards
                            solicitudes={solicitudesFiltradas.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            loading={loading}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSend={handleSend}
                            // onApprove={handleApprove}
                            onReject={handleReject}
                            permisos={permisos.globales}
                        />
                    </div>

                    <Main.Pages
                        currentPage={currentPage}
                        pageSize={pageSize}
                        total={solicitudesFiltradas.length}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />

                    <SolicitudModalView
                        visible={modalVisible}
                        form={form}
                        mode={modalMode}
                        solicitud={selectedSolicitud}
                        loading={loading}
                        onClose={handleCloseModal}
                        onSubmit={handleSubmit}
                        onSend={handleSend}
                        onReject={handleReject}
                    />
                </>
            )}
        </MainLayout>
    );
};

export default SOLICITUD;
