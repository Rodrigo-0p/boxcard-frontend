import * as React from 'react';
import Main from '../../../../../../util/main';
import RolesHeaderView from './RolesHeaderView';

const RolesHeader = ({ onRefreshData, onSave, onCancel, saving, selectedRole, permisos, dirtyCount }) => {
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
        <RolesHeaderView
            loading={loading}
            saving={saving}
            onRefresh={handleRefresh}
            onSave={onSave}
            onCancel={onCancel}
            selectedRole={selectedRole}
            permisos={permisos}
            dirtyCount={dirtyCount}
        />
    );
};

export default RolesHeader;
