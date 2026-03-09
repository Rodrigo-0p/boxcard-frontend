import React, { useState } from 'react';
import { Modal, Form, Input, Button, Tabs, message, Typography } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import Main from '../../util/main';
import { useAuth } from '../../context/AuthContext';
import './styles/ProfileModal.css';

const { Text } = Typography;

const ProfileModal = ({ visible, onClose }) => {
    const { nombre, setNombreActualizado } = useAuth();
    const [formDetails] = Form.useForm();
    const [formSecurity] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [newPassword, setNewPassword] = useState('');

    // Password requirements status
    const requirements = [
        { label: 'Mínimo 8 caracteres', met: newPassword.length >= 8 },
        { label: 'Al menos una mayúscula', met: /[A-Z]/.test(newPassword) },
        { label: 'Al menos una minúscula', met: /[a-z]/.test(newPassword) },
        { label: 'Al menos un número', met: /[0-9]/.test(newPassword) },
    ];

    const onFinishDetails = async (values) => {
        setLoading(true);
        try {
            const response = await Main.Request('/conf/profile/update-details', 'POST', values);
            if (response.data.success) {
                message.success({
                    content: 'Nombre actualizado correctamente',
                    icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
                });
                if (setNombreActualizado) {
                    setNombreActualizado(values.descripcion);
                }
            } else {
                message.error(response.data.message || 'Error al actualizar nombre');
            }
        } catch (error) {
            console.error(error);
            message.error('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const onFinishSecurity = async (values) => {
        if (values.passwordNueva !== values.passwordConfirmar) {
            return message.error('Las contraseñas nuevas no coinciden');
        }

        // Client side validation check
        const allMet = requirements.every(req => req.met);
        if (!allMet) {
            return message.warning('La contraseña no cumple con todos los requisitos de seguridad');
        }

        setLoading(true);
        try {
            const response = await Main.Request('/conf/profile/change-password', 'POST', {
                passwordActual: values.passwordActual,
                passwordNueva: values.passwordNueva
            });
            if (response.data.success) {
                message.success({
                    content: '¡Contraseña actualizada correctamente!',
                    icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
                });
                formSecurity.resetFields();
                setNewPassword('');
            } else {
                if (response.data.errors && Array.isArray(response.data.errors)) {
                    const errorMsg = (
                        <ul style={{ paddingLeft: 16, margin: 0, textAlign: 'left' }}>
                            {response.data.errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    );
                    message.error({
                        content: errorMsg,
                        duration: 5,
                    });
                } else {
                    message.error(response.data.message || 'Error al cambiar contraseña');
                }
            }
        } catch (error) {
            console.error(error);
            message.error('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Ajustes de Perfil"
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
            width={480}
            className="profile-modal"
        >
            <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
                <Tabs.TabPane
                    tab={<span><UserOutlined /> Datos</span>}
                    key="1"
                >
                    <div className="modal-body">
                        <div className="profile-card">
                            <Form
                                form={formDetails}
                                layout="vertical"
                                initialValues={{ descripcion: nombre }}
                                onFinish={onFinishDetails}
                            >
                                <Form.Item
                                    label={<Text strong style={{ fontSize: '12px' }}>Nombre Completo</Text>}
                                    name="descripcion"
                                    rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
                                    style={{ marginBottom: 12 }}
                                >
                                    <Input
                                        prefix={<UserOutlined style={{ color: '#0f3460' }} />}
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        block
                                        className="submit-button"
                                    >
                                        Guardar Cambios
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </Tabs.TabPane>

                <Tabs.TabPane
                    tab={<span><SafetyCertificateOutlined /> Seguridad</span>}
                    key="2"
                >
                    <div className="modal-body">
                        <div className="profile-card">
                            <Form
                                form={formSecurity}
                                layout="vertical"
                                onFinish={onFinishSecurity}
                            >
                                <Form.Item
                                    label={<Text strong style={{ fontSize: '12px' }}>Contraseña Actual</Text>}
                                    name="passwordActual"
                                    rules={[{ required: true, message: 'La contraseña actual es requerida' }]}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined style={{ color: '#0f3460' }} />}
                                        placeholder="Contraseña actual"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<Text strong style={{ fontSize: '12px' }}>Nueva Contraseña</Text>}
                                    name="passwordNueva"
                                    rules={[{ required: true, message: 'La nueva contraseña es requerida' }]}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined style={{ color: '#0f3460' }} />}
                                        placeholder="Nueva contraseña"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<Text strong style={{ fontSize: '12px' }}>Confirmar</Text>}
                                    name="passwordConfirmar"
                                    style={{ marginBottom: 12 }}
                                    rules={[
                                        { required: true, message: 'Confirme su contraseña' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('passwordNueva') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('No coincide'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined style={{ color: '#0f3460' }} />}
                                        placeholder="Repetir contraseña"
                                    />
                                </Form.Item>

                                <div className="requirements-grid">
                                    {requirements.map((req, index) => (
                                        <div key={index} className={`requirement-item ${newPassword ? (req.met ? 'met' : 'unmet') : ''}`}>
                                            {newPassword ? (
                                                req.met ? <CheckCircleFilled /> : <CloseCircleFilled />
                                            ) : (
                                                <CheckCircleFilled style={{ color: '#d9d9d9' }} />
                                            )}
                                            <span>{req.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <Form.Item style={{ marginBottom: 0, marginTop: 12 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        block
                                        className="submit-button"
                                    >
                                        Actualizar Contraseña
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    );
};

export default ProfileModal;
