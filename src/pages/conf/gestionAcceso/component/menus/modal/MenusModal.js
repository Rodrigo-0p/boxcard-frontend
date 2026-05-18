import * as React from 'react';
import Main from '../../../../../../util/main';
import MenusModalView from './MenusModalView';

const MenusModal = ({ visible, onCancel, onSave, loading, selectedMenu, menusList }) => {
    const [form] = Main.Form.useForm();

    React.useEffect(() => {
        if (visible) {
            if (selectedMenu) {
                form.setFieldsValue(selectedMenu);
            } else {
                form.resetFields();
                form.setFieldsValue({ estado: 'A', orden: 1 });
            }
        }
    }, [visible, selectedMenu, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSave(values);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    return (
        <MenusModalView
            visible={visible}
            onCancel={onCancel}
            onSave={handleSubmit}
            loading={loading}
            form={form}
            selectedMenu={selectedMenu}
            menusList={menusList}
        />
    );
};

export default MenusModal;
