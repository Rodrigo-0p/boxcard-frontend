import * as React from 'react';
import Main from '../../../../../../util/main';
import MenusHeaderView from './MenusHeaderView';

const MenusHeader = ({ totalMenus, onRefreshData, onCreate, permisos }) => {
    const [loading, setLoading] = React.useState(false);
    const message = Main.useMessage();

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
        <MenusHeaderView
            totalMenus={totalMenus}
            loading={loading}
            onRefresh={handleRefresh}
            onCreate={onCreate}
            permisos={permisos}
        />
    );
};

export default MenusHeader;
