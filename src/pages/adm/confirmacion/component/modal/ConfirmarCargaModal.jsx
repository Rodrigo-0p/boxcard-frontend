import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import { formatCurrency } from '../../../solicitud/data/solicitudesMock';

const ConfirmarCargaModal = ({
    visible,
    solicitud,
    onClose,
    onConfirm,
    loading
}) => {
    const [form] = Main.Form.useForm();

    // Resetear el form cada vez que el modal se abre o cierra
    // Esto evita que los estilos de validación (borde rojo) persistan en el DOM
    React.useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [visible, form]);

    const handleConfirm = async () => {
        try {
            const values = await form.validateFields();
            onConfirm(solicitud, values);
        } catch (error) {
            // Validación fallida — Ant Design ya muestra los errores
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Main.Modal
            title={<span style={{ fontWeight: 700, fontSize: '18px', color: '#1e293b' }}>
                <MainIcon.SafetyOutlined style={{ marginRight: '8px', color: '#059669' }} />
                {solicitud ? `Confirmación de Carga - SOL-${solicitud.nro_solicitud}` : 'Confirmación de Carga'}
            </span>}
            open={visible}
            onCancel={handleClose}
            width={600}
            destroyOnHidden
            maskClosable={false}
            footer={[
                <Main.Button key="back" onClick={handleClose}>
                    Cancelar
                </Main.Button>,
                <Main.Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    disabled={!solicitud}
                    icon={<MainIcon.CheckCircleOutlined />}
                    style={{ background: '#059669', borderColor: '#059669' }}
                    onClick={handleConfirm}
                >
                    Confirmar Habilitación
                </Main.Button>
            ]}
        >
            {solicitud ? (
                <div style={{ padding: '8px 0' }}>
                    {/* Resumen de la Solicitud */}
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                        <Main.Row gutter={24}>
                            <Main.Col span={12}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Empresa</div>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{solicitud.nombre_empresa}</div>
                            </Main.Col>
                            <Main.Col span={12}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Monto a Habilitar</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: '#059669' }}>{formatCurrency(solicitud.monto_solicitado)}</div>
                            </Main.Col>
                        </Main.Row>
                        <Main.Divider style={{ margin: '12px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span>Beneficiarios: <b>{solicitud.cant_beneficiarios} Empleados</b></span>
                            <span>Solicitante: <b>{solicitud.solicitante_nombre || solicitud.solicitante_username}</b></span>
                        </div>
                    </div>

                    {/* Formulario de Confirmación */}
                    <Main.Form
                        form={form}
                        layout="vertical"
                    >
                        <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #ced4da' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MainIcon.FileProtectOutlined style={{ color: '#059669' }} />
                                Datos del Comprobante
                            </div>

                            <Main.Form.Item
                                name="nro_comprobante"
                                label={<span style={{ fontWeight: 600 }}>Número de Comprobante / Referencia</span>}
                                rules={[{ required: true, message: 'El número de comprobante es obligatorio para confirmar la carga.' }]}
                                extra="Ingrese el número de boleta de depósito, transferencia o recibo de caja."
                            >
                                <Main.Input
                                    placeholder="Ej: TRANS-123456"
                                    size="large"
                                    prefix={<MainIcon.BarcodeOutlined style={{ color: '#94a3b8' }} />}
                                />
                            </Main.Form.Item>

                            <Main.Form.Item
                                label={<span style={{ fontWeight: 600 }}>Adjunto del Comprobante (Opcional)</span>}
                            >
                                <Main.Upload maxCount={1} showUploadList beforeUpload={() => false}>
                                    <Main.Button icon={<MainIcon.UploadOutlined />} style={{ width: '100%' }}>
                                        Seleccionar Imagen o PDF
                                    </Main.Button>
                                </Main.Upload>
                            </Main.Form.Item>
                        </div>
                    </Main.Form>

                    <Main.Alert
                        style={{ marginTop: '20px' }}
                        type="warning"
                        showIcon
                        message="IMPORTANTE"
                        description="Al confirmar esta carga, se habilitará automáticamente el saldo disponible a todos los beneficiarios incluidos en la lista. Esta acción no puede deshacerse."
                    />
                </div>
            ) : (
                <Main.Empty description="No se seleccionó ninguna solicitud" />
            )}
        </Main.Modal>
    );
};

export default ConfirmarCargaModal;



