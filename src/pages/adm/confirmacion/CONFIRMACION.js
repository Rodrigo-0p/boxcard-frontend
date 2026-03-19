import * as React from 'react';
import Main from '../../../util/main';
import MainIcon from '../../../util/mainIcon';
import ConfirmacionCards from './component/cards/ConfirmacionCards';
import ConfirmarCargaModal from './component/modal/ConfirmarCargaModal';
import ConfirmacionHeader from './component/header/ConfirmacionHeader';
import ConfirmacionToolbar from './component/toolbar/ConfirmacionToolbar';
import { formatCurrency } from '../solicitud/data/solicitudesMock';
import MainLayout from '../../../components/layout/MainLayout';
import MainUrl from '../solicitud/url/mainUrl';

const cod_form = 13; // El que creamos en la DB

const CONFIRMACION = () => {
    const menuProps = Main.useMenuNavigation(cod_form);
    const message = Main.useMessage();

    const [solicitudes, setSolicitudes] = React.useState([]);
    const [solicitudesFiltradas, setSolicitudesFiltradas] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(12);
    const [filters, setFilters] = React.useState({ searchText: '' });

    const loadPendientes = async () => {
        setLoading(true);
        try {
            const resp = await Main.Request(MainUrl.url_listar + '?tipo=confirmar', 'GET');
            if (resp.data.success) {
                // Filtramos solo las PENDIENTES
                const pendientes = resp.data.data.filter(s => s.estado === 'P');
                setSolicitudes(pendientes);
                setSolicitudesFiltradas(pendientes);
            } else {
                message.error(resp.data.mensaje);
            }
        } catch (error) {
            console.error('Error loadPendientes:', error);
            message.error('Error al cargar la bandeja de confirmación');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadPendientes();
    }, []);

    // Effect para aplicar filtros cuando solicitudes o filters cambian
    React.useEffect(() => {
        let filtered = [...solicitudes];
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

    const handleConfirmRequest = (record) => {
        setSelectedSolicitud(record);
        setModalVisible(true);
    };

    const handleApprove = async (record, formValues) => {
        try {
            setLoading(true);
            
            // Usamos FormData para soportar la subida de archivos (comprobante)
            const formData = new FormData();
            formData.append('cod_solicitud', record.cod_solicitud);
            formData.append('nro_comprobante', formValues.nro_comprobante);
            
            // Si hay un archivo adjunto, lo extraemos de la lista de Ant Design
            if (formValues.comprobante && formValues.comprobante.length > 0) {
                const file = formValues.comprobante[0].originFileObj;
                formData.append('comprobante', file);
            }

            const resp = await Main.Request(MainUrl.url_aprobar, 'POST', formData);
            if (resp.data.success) {
                message.success(resp.data.mensaje);
                setModalVisible(false);
                setSelectedSolicitud(null);
                loadPendientes();
            } else {
                message.error(resp.data.mensaje);
            }
        } catch (error) {
            console.error('Error handleApprove:', error);
            message.error('Error al procesar la habilitación');
        } finally {
            setLoading(false);
        }
    };
    
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
                    setLoading(true);
                    const resp = await Main.Request(MainUrl.url_rechazar, 'POST', {
                        cod_solicitud: record.cod_solicitud,
                        motivo_rechazo: motivo
                    });
                    if (resp.data.success) {
                        message.success(resp.data.mensaje);
                        setModalVisible(false);
                        setSelectedSolicitud(null);
                        loadPendientes();
                    } else {
                        message.error(resp.data.mensaje);
                    }
                } catch (error) {
                    message.error('Error al rechazar solicitud');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const stats = React.useMemo(() => {
        return {
            total: solicitudesFiltradas.length,
            montoTotal: solicitudesFiltradas.reduce((sum, s) => sum + (Number(s.monto_solicitado) || 0), 0),
        };
    }, [solicitudesFiltradas]);

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
            <div style={{ padding: '24px', paddingBottom: solicitudes.length >= pageSize ? '60px' : '24px' }}>
                <ConfirmacionHeader
                    stats={stats}
                    onRefresh={loadPendientes}
                    loading={loading}
                />

                <ConfirmacionToolbar
                    onFiltersChange={handleFiltersChange}
                />

                <ConfirmacionCards
                    solicitudes={solicitudesFiltradas.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                    loading={loading}
                    onConfirm={handleConfirmRequest}
                    onReject={handleReject}
                />
            </div>

            <Main.Pages
                currentPage={currentPage}
                pageSize={pageSize}
                total={solicitudesFiltradas.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />

            <ConfirmarCargaModal
                visible={modalVisible}
                solicitud={selectedSolicitud}
                onClose={() => setModalVisible(false)}
                onConfirm={handleApprove}
                onReject={handleReject}
                loading={loading}
            />
        </MainLayout>
    );
};

export default CONFIRMACION;
