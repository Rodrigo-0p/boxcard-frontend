import * as React from 'react';
import BeneficiariosModalView from './BeneficiariosModalView';
import Main from '../../../../../util/main';

const BeneficiariosModal = ({
    visible,
    mode,
    beneficiario,
    onClose,
    onSave,
    permisos
}) => {
    const [form] = Main.Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const message = Main.useMessage();
    // Snapshot de valores originales para detectar cambios en modo edición
    const valoresOriginales = React.useRef(null);

    React.useEffect(() => {
        if (visible && beneficiario && (mode === 'edit' || mode === 'view')) {
            const original = {
                nro_documento: beneficiario.nro_documento,
                ruc: beneficiario.ruc,
                nombre_completo: beneficiario.nombre_completo,
                correo: beneficiario.correo,
                nro_telef: beneficiario.nro_telef,
                estado: beneficiario.estado,
                monto_limite: beneficiario.monto_limite ?? 0,
            };
            form.setFieldsValue(original);
            valoresOriginales.current = original;
        }
        if (visible && mode === 'create') {
            form.resetFields();
            valoresOriginales.current = null;
        }
    }, [visible, beneficiario, mode, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Detectar si no se realizaron cambios en modo edición
            if (mode === 'edit' && valoresOriginales.current) {
                const camposEditables = ['nombre_completo', 'ruc', 'correo', 'nro_telef', 'estado', 'monto_limite'];
                const sinCambios = camposEditables.every(campo => {
                    const original = valoresOriginales.current[campo] ?? '';
                    const actual = values[campo] ?? '';
                    return String(original).trim() === String(actual).trim();
                });

                if (sinCambios) {
                    message.info('No se realizaron cambios en el registro.');
                    return;
                }
            }

            setLoading(true);
            await onSave(values);

        } catch (error) {
            if (error.errorFields) {
                message.warning('Complete los campos requeridos');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        valoresOriginales.current = null;
        onClose();
    };

    return (
        <BeneficiariosModalView
            visible={visible}
            mode={mode}
            form={form}
            onClose={handleClose}
            onSubmit={handleSubmit}
            loading={loading}
            permisos={permisos}
        />
    );
};

export default BeneficiariosModal;
