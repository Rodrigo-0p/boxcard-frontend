import * as React from 'react';
import Main from '../../../util/main';
import MainIcon from '../../../util/mainIcon';
import MainLayout from '../../../components/layout/MainLayout';
import SolicitudReporteTable from './component/table/SolicitudReporteTable';
import SolicitudModalView from './component/modal/SolicitudModalView';
import MainUrl from './url/mainUrl';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Configurar locale global
dayjs.locale('es');

const cod_form = 15;

const SOLICITUD_REPORTE = () => {
    const menuProps = Main.useMenuNavigation(cod_form);
    const message = Main.useMessage();
    const [form] = Main.Form.useForm();
    // const { permisos, loading: permisosLoading } = Main.usePermisos(['nominas_solic']);

    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = React.useState(null);

    const [stats, setStats] = React.useState({ count: 0, total: 0 });

    const [filters, setFilters] = React.useState({
        fecha_desde: dayjs().startOf('month').format('YYYY-MM-DD'),
        fecha_hasta: dayjs().endOf('month').format('YYYY-MM-DD'),
        estado: 'all'
    });

    const loadReporte = async () => {
        setLoading(true);
        try {
            const query = `?fecha_desde=${filters.fecha_desde}&fecha_hasta=${filters.fecha_hasta}&estado=${filters.estado}`;
            const resp = await Main.Request(`${MainUrl.url_reporte}${query}`, 'GET');

            if (resp.data.success) {
                const reportData = resp.data.data;
                setData(reportData);
                const total = reportData.reduce((acc, curr) => acc + Number(curr.monto_solicitado || 0), 0);
                setStats({ count: reportData.length, total });
            } else {
                message.error(resp.data.mensaje || 'Error al cargar el reporte');
            }
        } catch (error) {
            message.error('Error de conexión al cargar el reporte');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadReporte();
    }, [filters]);

    const handleView = (record) => {
        setSelectedSolicitud(record);
        setModalVisible(true);
    };

    return (
        <MainLayout {...menuProps}>
            <div style={{ padding: '0 24px 24px 24px' }}>
                {/* Standard Header */}
                <div className="empresas-header" style={{ marginTop: '24px' }}>
                    <div className="header-left">
                        <h1 className="header-title">
                            <MainIcon.HistoryOutlined /> Histórico de Solicitudes
                        </h1>
                        <p className="header-description">
                            {loading ? 'Consultando histórico...' : (
                                <span>
                                    Se encontraron <b style={{ color: '#1e293b' }}>{stats.count}</b> registros
                                    - Monto Total: <b style={{ color: '#059669' }}>₲ {stats.total.toLocaleString('es-PY')}</b>
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="header-right">
                        <Main.Space>
                            <Main.Button
                                icon={<MainIcon.ReloadOutlined spin={loading} />}
                                onClick={loadReporte}
                                loading={loading}
                                className="btn-icon-only"
                            />
                            <Main.Button
                                type="primary"
                                icon={<MainIcon.FileExcelOutlined />}
                                className="btn-primary"
                                disabled
                            >
                                Exportar Reporte
                            </Main.Button>
                        </Main.Space>
                    </div>
                </div>

                {/* Standard Toolbar / Filters */}
                <div style={{
                    background: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}>
                    <Main.Row gutter={24} align="bottom">
                        <Main.Col xs={24} md={5}>
                            <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                                Mes de Consulta ({dayjs().format('YYYY')})
                            </div>
                            <Main.Select
                                style={{ width: '100%', height: '38px' }}
                                dropdownStyle={{ borderRadius: '8px' }}
                                placeholder="Seleccionar Mes"
                                value={
                                    dayjs(filters.fecha_desde).year() === dayjs().year() &&
                                        dayjs(filters.fecha_desde).date() === 1 &&
                                        dayjs(filters.fecha_hasta).isSame(dayjs(filters.fecha_desde).endOf('month'), 'day')
                                        ? dayjs(filters.fecha_desde).month() : null
                                }
                                onChange={(monthIndex) => {
                                    const startOfMonth = dayjs().year(dayjs().year()).month(monthIndex).startOf('month');
                                    const endOfMonth = startOfMonth.endOf('month');
                                    setFilters(prev => ({
                                        ...prev,
                                        fecha_desde: startOfMonth.format('YYYY-MM-DD'),
                                        fecha_hasta: endOfMonth.format('YYYY-MM-DD')
                                    }));
                                }}
                                className="custom-select"
                                allowClear
                            >
                                {dayjs.months().map((month, index) => (
                                    <Main.Select.Option key={index} value={index}>
                                        {month.charAt(0).toUpperCase() + month.slice(1)}
                                    </Main.Select.Option>
                                ))}
                            </Main.Select>
                        </Main.Col>
                        <Main.Col xs={24} md={12}>
                            <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Rango de Fechas Personalizado</div>
                            <Main.DatePicker.RangePicker
                                style={{ width: '100%', height: '38px', borderRadius: '8px' }}
                                value={filters.fecha_desde && filters.fecha_hasta ? [dayjs(filters.fecha_desde), dayjs(filters.fecha_hasta)] : null}
                                onChange={(dates) => {
                                    setFilters(prev => ({
                                        ...prev,
                                        fecha_desde: dates ? dates[0].format('YYYY-MM-DD') : dayjs().startOf('month').format('YYYY-MM-DD'),
                                        fecha_hasta: dates ? dates[1].format('YYYY-MM-DD') : dayjs().endOf('month').format('YYYY-MM-DD')
                                    }));
                                }}
                                placeholder={['Inicio', 'Fin']}
                                format="DD/MM/YYYY"
                                allowClear={false}
                            />
                        </Main.Col>
                        <Main.Col xs={24} md={7}>
                            <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Filtrar por Estado</div>
                            <Main.Select
                                style={{ width: '100%', height: '38px' }}
                                dropdownStyle={{ borderRadius: '8px' }}
                                value={filters.estado}
                                onChange={(val) => setFilters(prev => ({ ...prev, estado: val }))}
                                className="custom-select"
                                allowClear
                            >
                                <Main.Select.Option value="all">Todos los Finalizados</Main.Select.Option>
                                <Main.Select.Option value="C">Confirmadas</Main.Select.Option>
                                <Main.Select.Option value="R">Rechazadas</Main.Select.Option>
                                <Main.Select.Option value="A">Anuladas</Main.Select.Option>
                            </Main.Select>
                        </Main.Col>
                    </Main.Row>
                </div>

                {/* Tabla de Reporte */}
                <SolicitudReporteTable
                    solicitudes={data}
                    loading={loading}
                    onView={handleView}
                />
            </div>

            {/* Modal de Detalle */}
            <SolicitudModalView
                visible={modalVisible}
                form={form}
                mode="view"
                solicitud={selectedSolicitud}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedSolicitud(null);
                }}
            />
        </MainLayout>
    );
};

export default SOLICITUD_REPORTE;
