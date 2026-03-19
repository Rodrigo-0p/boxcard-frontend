import * as React from 'react';
import SolicitudHeaderView from './SolicitudHeaderView';
import Main from '../../../../../util/main';

const SolicitudHeader = ({
    totalSolicitudes = 0,
    stats,
    filters,
    onRefreshData,
    onCreate,
    loading = false,
    permisos
}) => {
    return (
        <SolicitudHeaderView
            totalSolicitudes={totalSolicitudes}
            stats={stats}
            filters={filters}
            loading={loading}
            onNuevaSolicitud={onCreate}
            onRefresh={onRefreshData}
            permisos={permisos}
        />
    );
};

export default SolicitudHeader;
