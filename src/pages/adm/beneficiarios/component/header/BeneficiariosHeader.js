import * as React from 'react';
import BeneficiariosHeaderView from './BeneficiariosHeaderView';
import Main from '../../../../../util/main';

const BeneficiariosHeader = ({
    totalBeneficiarios = 0,
    onRefreshData,
    handleExportar,
    onDescargarModelo,
    onImportar,
    onNuevo
}) => {
    const message = Main.useMessage();
    const [loading, setLoading] = React.useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            if (onRefreshData) {
                await onRefreshData();
                message.success('Datos actualizados');
            }
        } catch (error) {
            message.error('Error al actualizar datos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BeneficiariosHeaderView
            totalBeneficiarios={totalBeneficiarios}
            loading={loading}
            onRefresh={handleRefresh}
            onExportar={handleExportar}
            onDescargarModelo={onDescargarModelo}
            onImportar={onImportar}
            onNuevo={onNuevo}
        />
    );
};

export default BeneficiariosHeader;
