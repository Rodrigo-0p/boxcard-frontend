import * as React from 'react';
import Main from '../../../../../util/main';
import UsuarioHeaderView from './UsuarioHeaderView';

const UsuarioHeader = ({ totalUsuarios
    , onRefreshData
    , onCreate
    , permisos
    , handleExportar }) => {

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
            console.error('Error al refrescar:', error);
            message.error('Error al actualizar datos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <UsuarioHeaderView
            totalUsuarios={totalUsuarios}
            loading={loading}
            onRefresh={handleRefresh}
            onCreate={onCreate}
            onExportar={handleExportar}
            permisos={permisos}
        />
    );
};

export default UsuarioHeader;
