import * as React from 'react';
import MainIcon from '../../../../../util/mainIcon';
import Main from '../../../../../util/main';
import { useAuth } from '../../../../../context/AuthContext';
const { Option } = Main.Select;

const PersonaModalView = ({ visible, mode, persona, loading, onClose, onSubmit, permisos,
  empresasDisp = [], loadingData, canSelectEmp
}) => {

  const { empresa } = useAuth()
  const [form] = Main.Form.useForm();
  const message = Main.useMessage();
  const [initialData, setInitialData] = React.useState(null);
  const [estadoLabel, setEstadoLabel] = React.useState(true);

  React.useEffect(() => {
    if (!visible) return;

    if (persona && mode !== 'create') {
      const data = {
        cod_persona: persona.cod_persona || '',
        descripcion: persona.descripcion || '',
        nro_documento: persona.nro_documento || '',
        nro_telef: persona.nro_telef || '',
        correo: persona.correo || '',
        estado: persona.estado === 'A',
        cod_empresa: persona.cod_empresa || ''
      };
      form.setFieldsValue(data);
      setInitialData(data);
      setEstadoLabel(persona.estado === 'A');
    } else {
      const data = {
        estado: true,
        cod_empresa: empresa.cod_empresa || ''
      };
      form.resetFields();
      setInitialData(null);
      form.setFieldsValue(data);
      setEstadoLabel(true);
    }
  }, [persona, mode, visible, form, empresasDisp, empresa.cod_empresa]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (mode === 'edit' && initialData) {
        const hasChanges =
          values.cod_persona !== initialData.cod_persona ||
          values.descripcion !== initialData.descripcion ||
          values.nro_documento !== initialData.nro_documento ||
          values.nro_telef !== initialData.nro_telef ||
          values.correo !== initialData.correo ||
          values.cod_empresa !== initialData.cod_empresa ||
          values.estado !== initialData.estado;

        if (!hasChanges) {
          message.info('No hay cambios para guardar');
          return;
        }
      }

      const dataToSend = {
        ...values,
        estado: values.estado ? 'A' : 'I'
      };

      if (onSubmit) onSubmit(dataToSend);

    } catch (error) {
      console.error('Error en validación:', error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    if (onClose) onClose();
  };

  const modalConfig = {
    create: {
      title: 'Nueva Persona', subtitle: 'Complete la información personal',
      icon: <MainIcon.UserAddOutlined />, okText: 'Crear', disabled: false
    },
    edit: {
      title: 'Editar Persona', subtitle: 'Modifique los datos necesarios',
      icon: <MainIcon.EditOutlined />, okText: 'Guardar', disabled: false
    },
    view: {
      title: 'Detalle de Persona', subtitle: 'Información personal',
      icon: <MainIcon.EyeOutlined />, okText: null, disabled: true
    }
  };

  const config = modalConfig[mode] || modalConfig.create;

  return (
    <Main.Modal open={visible} onCancel={handleClose} footer={null} closable={false}
      width={700} className="persona-modal" centered maskClosable={false} keyboard={false}>

      <div className="persona-modal-header">
        <div className="modal-title-section">
          <div className="modal-icon">{config.icon}</div>
          <div>
            <div className="modal-title">{config.title}</div>
            <div className="modal-subtitle">{config.subtitle}</div>
          </div>
        </div>
        <button className="modal-close-btn" onClick={handleClose} disabled={loading}>
          <MainIcon.CloseOutlined />
        </button>
      </div>

      <div className="persona-modal-body">
        <Main.Form form={form} layout="vertical" disabled={config.disabled}>

          {/* INFORMACIÓN PERSONAL */}
          <div className="form-section">
            <div className="section-title">
              <MainIcon.IdcardOutlined style={{ marginRight: '5px' }} />
              Información Personal
            </div>
            <Main.Row gutter={[12, 0]}>
              <Main.Col span={6}>
                <Main.Form.Item name="cod_persona" label="Código">
                  <Main.Input disabled={true} style={{ fontWeight: 'bold', textAlign: 'right' }} />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={18}>
                <Main.Form.Item name="descripcion" label="Nombre Completo"
                  rules={[
                    { required: true, message: 'Nombre completo es requerido' },
                    { min: 3, message: 'Mínimo 3 caracteres' }
                  ]}>
                  <Main.Input autoFocus={true} placeholder="Ej: Juan Pérez González" maxLength={100} />
                </Main.Form.Item>
              </Main.Col>
            </Main.Row>

            <div className="form-grid">
              <Main.Form.Item name="nro_documento" label="Nro. Documento"
                rules={[
                  { required: true, message: 'Documento es requerido' }
                ]}>
                <Main.Input placeholder="Ej: 12345678" maxLength={20} onKeyDown={Main.soloNumero} />
              </Main.Form.Item>

              <Main.Form.Item name="nro_telef" label="Teléfono"
                rules={[
                  { required: true, message: 'Teléfono es requerido' }
                ]}>
                <Main.Input placeholder="Ej: 0981123456" maxLength={20} />
              </Main.Form.Item>

              <Main.Form.Item name="correo" label="Correo Electrónico"
                rules={[
                  { required: true, message: 'Email es requerido' },
                  { type: 'email', message: 'Email inválido' }
                ]}
                className="form-item-full">
                <Main.Input placeholder="Ej: usuario@empresa.com" maxLength={100} />
              </Main.Form.Item>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <MainIcon.SettingOutlined style={{ marginRight: '5px' }} />
              Configuración
            </div>
            <div className="form-grid">
              <Main.Form.Item name="cod_empresa" hidden>
                <Main.Input />
              </Main.Form.Item>

              <Main.Form.Item label="Estado">
                <div className='estadoContent'>
                  <Main.Form.Item name="estado" valuePropName="checked">
                    <Main.Switch onChange={(e) => setEstadoLabel(e)} />
                  </Main.Form.Item>
                  <span className="estadoLabel">{estadoLabel ? "Activo" : "Inactivo"}</span>
                </div>
              </Main.Form.Item>
            </div>
          </div>

        </Main.Form>
      </div>

      <div className="persona-modal-footer">
        <button className="btn-modal btn-cancel" onClick={handleClose} disabled={loading}>
          {mode === 'view' ? 'Cerrar' : 'Cancelar'}
        </button>
        {config.okText && (
          <button className="btn-modal btn-submit" onClick={handleFormSubmit} disabled={loading}>
            {loading ? 'Guardando...' : config.okText}
          </button>
        )}
      </div>
    </Main.Modal>
  );
};

export default PersonaModalView;