import * as React from 'react';
import Main from '../../../../../util/main'
import MainIcon from '../../../../../util/mainIcon'
import { formatCurrency } from '../../../solicitud/data/solicitudesMock';

const ConfirmacionHeaderView = ({
    stats,
    onRefresh,
    loading
}) => {
    return (
        <div className="empresas-header">
            <div className="header-left">
                <h1 className="header-title"><MainIcon.SolutionOutlined /> Centro de Confirmación de Cargas</h1>
                <p className="header-description">
                    {loading
                        ? 'Cargando...'
                        : `${stats.total} solicitud${stats.total !== 1 ? 'es' : ''} pendiente${stats.total !== 1 ? 's' : ''} - Total a confirmar: ${formatCurrency(stats.montoTotal)}`
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
                </Main.Space>
            </div>
        </div>
    );
};

export default ConfirmacionHeaderView;
