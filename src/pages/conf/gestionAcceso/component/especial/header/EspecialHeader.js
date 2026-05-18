import * as React from 'react';
import Main from '../../../../../../util/main';
import EspecialHeaderView from './EspecialHeaderView';

const EspecialHeader = ({ onRefreshData, onSave, onCancel, dirtyCount, saving, permisos }) => {
    const [loading, setLoading] = React.useState(false);
    const message = Main.useMessage();

    const handleRefresh = async () => {
        setLoading(true);
        try {
            if (onRefreshData) {
                await onRefreshData();
                message.success('Estructura actualizada');
            }
        } catch (error) {
            console.error('Error al refrescar:', error);
            message.error('Error al actualizar datos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <EspecialHeaderView
            loading={loading || saving}
            onRefresh={handleRefresh}
            onSave={onSave}
            onCancel={onCancel}
            dirtyCount={dirtyCount}
            permisos={permisos}
        />
    );
};

export default EspecialHeader;
