import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const { Option } = Main.Select;

const BeneficiariosModalView = ({
    visible,
    mode,
    form,
    onClose,
    onSubmit,
    loading,
    permisos,
}) => {

    const isView = mode === 'view';
    const isCreate = mode === 'create';
    const title = isCreate ? 'Nuevo Beneficiario' : isView ? 'Detalle Beneficiario' : 'Editar Beneficiario';

    return (
        <Main.Modal
            title={
                <span>
                    {isCreate ? <MainIcon.UserAddOutlined /> : isView ? <MainIcon.EyeOutlined /> : <MainIcon.EditOutlined />}
                    {' '}{title}
                </span>
            }
            open={visible}
            onCancel={onClose}
            width={620}
            footer={isView ? [
                <Main.Button key="close" onClick={onClose}>Cerrar</Main.Button>
            ] : [
                <Main.Button key="cancel" onClick={onClose}>Cancelar</Main.Button>,
                <Main.Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={onSubmit}
                    icon={<MainIcon.CheckOutlined />}
                >
                    {isCreate ? 'Registrar' : 'Guardar'}
                </Main.Button>
            ]}
        >
            <Main.Form
                form={form}
                layout="vertical"
                disabled={isView}
                size="middle"
            >
                {/* Nombre y Apellido */}
                <Main.Row gutter={16}>
                    <Main.Col span={24}>
                        <Main.Form.Item
                            name="nombre_completo"
                            label="Nombre y Apellido"
                            rules={[{ required: true, message: 'Nombre y Apellido son requeridos' }]}
                        >
                            <Main.Input placeholder="Ej: Juan Pérez" />
                        </Main.Form.Item>
                    </Main.Col>
                </Main.Row>

                {/* Documento y RUC */}
                <Main.Row gutter={16}>
                    <Main.Col span={12}>
                        <Main.Form.Item
                            name="nro_documento"
                            label="Documento de Identidad"
                            rules={[{ required: true, message: 'Documento requerido' }]}
                        >
                            <Main.Input
                                placeholder="Ej: 1234567"
                                onKeyDown={Main.soloNumero}
                                inputMode="numeric"
                                maxLength={15}
                                disabled={!isCreate}
                            />
                        </Main.Form.Item>
                    </Main.Col>
                    <Main.Col span={12}>
                        <Main.Form.Item
                            name="ruc"
                            label="RUC"
                        >
                            <Main.Input
                                placeholder="000 - 0"
                                maxLength={20}
                            />
                        </Main.Form.Item>
                    </Main.Col>
                </Main.Row>

                {/* Teléfono y Correo */}
                <Main.Row gutter={16}>
                    <Main.Col span={12}>
                        <Main.Form.Item
                            name="nro_telef"
                            label="Teléfono Móvil"
                        >
                            <Main.Input
                                placeholder="0981..."
                                onKeyDown={Main.soloNumero}
                                maxLength={15}
                            />
                        </Main.Form.Item>
                    </Main.Col>
                    <Main.Col span={12}>
                        <Main.Form.Item
                            name="correo"
                            label="Correo Electrónico"
                            rules={[{ type: 'email', message: 'Email inválido' }]}
                        >
                            <Main.Input placeholder="correo@ejemplo.com" />
                        </Main.Form.Item>
                    </Main.Col>
                </Main.Row>

                {/* Monto límite + Estado (lado a lado) */}
                <Main.Row gutter={16}>
                    <Main.Col span={12}>
                        <Main.Form.Item
                            name="monto_limite"
                            label={
                                <span>
                                    Monto Límite{' '}
                                    <Main.Tooltip title="Monto máximo que puede solicitar este beneficiario. Deje en 0 para ilimitado.">
                                        <MainIcon.InfoCircleOutlined style={{ color: '#8c8c8c', cursor: 'help' }} />
                                    </Main.Tooltip>
                                </span>
                            }
                        >
                            <Main.InputNumber
                                placeholder="0 = Sin límite"
                                min={0}
                                style={{ width: '100%' }}
                                formatter={v => v ? `Gs. ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                                parser={v => v.replace(/Gs\.\s?|(\.)/g, '')}
                            />
                        </Main.Form.Item>
                    </Main.Col>

                    {/* Estado – solo en edición/vista */}
                    {!isCreate && (
                        <Main.Col span={12}>
                            <Main.Form.Item
                                name="estado"
                                label="Estado del Beneficiario"
                            >
                                <Main.Select disabled={isView}>
                                    <Option value="A">Activo</Option>
                                    <Option value="I">Inactivo</Option>
                                </Main.Select>
                            </Main.Form.Item>
                        </Main.Col>
                    )}
                </Main.Row>
            </Main.Form>
        </Main.Modal>
    );
};

export default BeneficiariosModalView;
