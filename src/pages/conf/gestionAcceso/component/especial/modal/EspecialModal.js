import * as React from 'react';
import Main from '../../../../../../util/main';
import EspecialModalView from './EspecialModalView';

const EspecialModal = ({ visible, onCancel, onSave, onRevoke, loading, selectedUser, assignedPerms }) => {
    const [form] = Main.Form.useForm();
    const [menus, setMenus] = React.useState([]);
    const [roles, setRoles] = React.useState([]);

    const loadData = async () => {
        try {
            const [mResp, rResp] = await Promise.all([
                Main.Request('/adm/configuracion/menus/listar', 'GET'),
                Main.Request('/adm/configuracion/roles/listar', 'GET')
            ]);
            if (mResp.data.success) setMenus(mResp.data.data);
            if (rResp.data.success) setRoles(rResp.data.data);
        } catch (error) {
            console.error('Error loading modal data:', error);
        }
    };

    React.useEffect(() => {
        if (visible) {
            loadData();
            form.resetFields();
            form.setFieldsValue({ 
                cod_empresa: 1,
                usuario_pg: selectedUser?.usuario_pg 
            });
        }
    }, [visible, selectedUser]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSave(values);
            form.setFieldsValue({ cod_role: undefined, cod_menu: undefined }); // Limpiar selección tras agregar
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <EspecialModalView
            visible={visible}
            onCancel={onCancel}
            onSave={handleSubmit}
            onRevoke={onRevoke}
            loading={loading}
            form={form}
            selectedUser={selectedUser}
            assignedPerms={assignedPerms}
            menus={menus}
            roles={roles}
        />
    );
};

export default EspecialModal;
