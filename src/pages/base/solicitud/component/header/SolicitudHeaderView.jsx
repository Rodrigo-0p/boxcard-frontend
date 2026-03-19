import * as React from 'react';
import Main from '../../../../../util/main'
import MainIcon from '../../../../../util/mainIcon'

const SolicitudHeaderView = ({
    totalSolicitudes,
    stats,
    filters,
    onNuevaSolicitud,
    onRefresh,
    loading,
    permisos
}) => {
    return (
        <div className="empresas-header">
            <div className="header-left">
                <h1 className="header-title"><MainIcon.CarryOutOutlined /> Solicitudes de Carga</h1>
                <p className="header-description" style={{ color: '#64748b', fontSize: '14px' }}>
                    {loading
                        ? 'Actualizando solicitudes...'
                        : stats ? (
                            <span>
                                <b style={{ color: '#1e293b' }}>{totalSolicitudes}</b> solicitud{totalSolicitudes !== 1 ? 'es' : ''}
                                {filters?.estadoFilter !== 'all' || filters?.searchText ? ' encontradas' : ' registradas'}
                                {stats.montoTotal > 0 && (
                                    <> - Monto Confirmado: <b style={{ color: '#059669' }}>₲ {stats.montoTotal.toLocaleString('es-PY')}</b></>
                                )}
                                {stats.pendiente > 0 && (
                                    <> - <b style={{ color: '#d97706' }}>{stats.pendiente}</b> Pendiente{stats.pendiente !== 1 ? 's' : ''}</>
                                )}
                            </span>
                        ) : 'Cargando bandeja...'
                    }
                </p>
            </div>

            <div className="header-right">
                <Main.Space size="small">

                    <Main.Button
                        icon={<MainIcon.ReloadOutlined spin={loading} />}
                        onClick={onRefresh}
                        loading={loading}
                        className="btn-icon-only"
                    />

                    <Main.Button
                        type="primary"
                        icon={<MainIcon.PlusOutlined />}
                        onClick={onNuevaSolicitud}
                        className="btn-primary"
                    >
                        Nueva Solicitud
                    </Main.Button>
                </Main.Space>
            </div>
        </div>
    );
};

export default SolicitudHeaderView;
