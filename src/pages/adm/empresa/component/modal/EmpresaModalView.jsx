import * as React from 'react';
import MainIcon from '../../../../../util/mainIcon';
import Main from '../../../../../util/main';
import { useAuth } from '../../../../../context/AuthContext'
import './EmpresaModal.css';

const { Option } = Main.Select;

const UPLOAD_CONFIG = {
  MAX_SIZE_MB: 2,
  MAX_SIZE_BYTES: 2 * 1024 * 1024
};

const EmpresaModalView = ({ visible, mode, empresa, loading, onClose, onSubmit, permisos }) => {

  const message = Main.useMessage();
  const [form] = Main.Form.useForm();
  const [logoFile, setLogoFile] = React.useState(null);
  const [logoPreview, setLogoPreview] = React.useState(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [initialData, setInitialData] = React.useState(null);

  const { getLogo, role } = useAuth()

  React.useEffect(() => {
    if (!visible) return;

    const loadModal = async () => {
      if (empresa && mode !== 'create') {
        const data = {
          ruc: empresa.ruc || '',
          nombre: empresa.nombre || '',
          direccion: empresa.direccion || '',
          correo: empresa.correo || '',
          nro_telef: empresa.nro_telef || '',
          tip_empresa: empresa.tip_empresa || '',
          modalidad: empresa.modalidad || '',
          limite_credito: empresa.limite_credito || 0,
          es_proveedor: empresa.es_proveedor === 'S',
          estado: empresa.estado === 'A',
          logo_url: empresa.logo_url || null
        };
        form.setFieldsValue(data);
        setInitialData(data);

        if (empresa.logo_url) {
          const base64String = await getLogo(empresa.logo_url);
          if (base64String) {
            setLogoPreview(base64String);
          }
        }
      } else {
        form.resetFields();
        form.setFieldsValue({ estado: true });
        setLogoFile(null);
        setLogoPreview(null);
        setInitialData(null);
      }
    }

    loadModal();
  }, [empresa, mode, visible, form]);

  React.useEffect(() => {
    const modalBody = document.querySelector('.empresa-modal-body');
    const handleScroll = () => {
      document.querySelectorAll('.ant-select-focused').forEach(select => select.blur());
      document.activeElement?.blur();
    };

    if (modalBody) modalBody.addEventListener('scroll', handleScroll);
    return () => { if (modalBody) modalBody.removeEventListener('scroll', handleScroll); };
  }, [visible]);

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handlePreviewClick = () => {
    if (logoPreview) {
      setPreviewImage(logoPreview);  // Usa logoPreview que contiene la imagen recortada
      setPreviewOpen(true);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (mode === 'edit' && initialData) {
        const hasChanges =
          values.nombre !== initialData.nombre ||
          values.ruc !== initialData.ruc ||
          values.direccion !== initialData.direccion ||
          values.correo !== initialData.correo ||
          values.nro_telef !== initialData.nro_telef ||
          values.tip_empresa !== initialData.tip_empresa ||
          values.modalidad !== initialData.modalidad ||
          values.limite_credito !== initialData.limite_credito ||
          values.es_proveedor !== initialData.es_proveedor ||
          values.estado !== initialData.estado ||
          logoFile !== null;

        if (!hasChanges) {
          message.info('No hay cambios para guardar');
          return;
        }
      }
      if (onSubmit) {
        onSubmit({
          ...values,
          estado: values.estado ? 'A' : 'I',
          logo: logoFile
        });
      }
    } catch (error) {
      console.error('Error en validación:', error.values || error);
    }
  };

  const handleUploadChange = (file) => {
    // Validar tamaño
    if (file.size > UPLOAD_CONFIG.MAX_SIZE_BYTES) {
      message.error(`La imagen debe ser menor a ${UPLOAD_CONFIG.MAX_SIZE_MB}MB`);
      return Main.Upload.LIST_IGNORE;
    }

    // Guardar el archivo recortado
    setLogoFile(file);

    // Generar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    return false; // Prevenir upload automático
  }

  const handleClose = () => {
    form.resetFields();
    setLogoFile(null);
    setLogoPreview(null);
    setPreviewOpen(false);
    setPreviewImage('');
    if (onClose) onClose();
  };

  const modalConfig = {
    create: { title: 'Nueva Empresa', subtitle: 'Complete la información requerida', icon: <MainIcon.PlusOutlined />, okText: 'Crear', disabled: false },
    edit: { title: 'Editar Empresa', subtitle: 'Modifique los datos necesarios', icon: <MainIcon.EditOutlined />, okText: 'Guardar', disabled: false },
    view: { title: 'Detalle de Empresa', subtitle: 'Información de la empresa', icon: <MainIcon.EyeOutlined />, okText: null, disabled: true }
  };

  const config = modalConfig[mode] || modalConfig.create;

  return (
    <Main.Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      closable={false}
      width={800}
      className="empresa-modal"
      centered
      maskClosable={false}
      keyboard={false}
    >
      <div className="empresa-modal-header">
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

      <div className="empresa-modal-body">
        <Main.Form form={form} layout="vertical" disabled={config.disabled}>

          {/* LOGO UPLOAD CON IMG CROP */}
          <div className="form-section">
            <div className="upload-title">Logo de la Empresa</div>

            <div className="upload-container">
              {logoPreview ? (
                <div className="logo-preview-wrapper">
                  <img src={logoPreview} alt="Logo" className="logo-preview-img" />
                  <div className="logo-actions">
                    <button type="button" className="logo-action-btn" onClick={handlePreviewClick} disabled={!permisos.view}>
                      <MainIcon.EyeOutlined />
                    </button>
                    {!config.disabled && (
                      <button type="button" className="logo-action-btn" onClick={handleRemoveLogo}>
                        <MainIcon.DeleteOutlined />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // Cambia la sección de ImgCrop:
                <Main.ImgCrop
                  rotate
                  aspect={1}
                  quality={1}
                  modalTitle="Editar imagen de logo"
                  modalOk="Aplicar"
                  modalCancel="Cancelar"
                  grid
                  rotationSlider
                  showReset
                  cropShape="rect"
                  minZoom={0.1}
                  maxZoom={3}
                  zoomSlider
                  fillColor="transparent"
                  cropperProps={{
                    objectFit: 'contain',
                    restrictPosition: false
                  }}
                >
                  <Main.Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleUploadChange}
                    disabled={config.disabled}
                  >
                    <div className="upload-placeholder">
                      <div className="upload-icon">
                        <MainIcon.FileImageOutlined />
                      </div>
                      <div className="upload-text">Subir Img</div>
                      <div className="upload-hint">JPEG,PNG,JPG • Máx. {UPLOAD_CONFIG.MAX_SIZE_MB}MB</div>
                    </div>
                  </Main.Upload>
                </Main.ImgCrop>
              )}
            </div>

            <Main.Image
              style={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (vis) => {
                  setPreviewOpen(vis);
                  if (!vis) setPreviewImage('');
                },
                src: previewImage
              }}
            />
          </div>

          {/* INFORMACIÓN BÁSICA */}
          <div className="form-section">
            <div className="section-title">Información Básica</div>
            <div className="form-grid">
              <Main.Form.Item name="ruc" label="RUC" rules={[{ required: true, message: 'RUC es requerido' }, { pattern: /^[\d-]+$/, message: 'Solo números y guion' }]}>
                <Main.Input autoFocus={true} placeholder="Ej: 80012345-6" maxLength={20} />
              </Main.Form.Item>
              <Main.Form.Item name="nombre" label="Nombre Comercial" rules={[{ required: true, message: 'Nombre es requerido' }]}>
                <Main.Input placeholder="" maxLength={100} />
              </Main.Form.Item>
              <Main.Form.Item name="direccion" label="Dirección" rules={[{ required: true, message: 'Dirección es requerida' }]} className="form-item-full">
                <Main.Input placeholder="" maxLength={200} />
              </Main.Form.Item>
            </div>
          </div>

          {/* DATOS DE CONTACTO */}
          <div className="form-section">
            <div className="section-title">Datos de Contacto</div>
            <div className="form-grid">
              <Main.Form.Item name="correo" label="Correo Electrónico" rules={[{ required: true, message: 'Email es requerido' }, { type: 'email', message: 'Email inválido' }]}>
                <Main.Input placeholder="Ej: contacto@empresa.com" maxLength={100} />
              </Main.Form.Item>
              <Main.Form.Item name="nro_telef" label="Teléfono" rules={[{ required: true, message: 'Teléfono es requerido' }, { pattern: /^\d+$/, message: 'Solo números' }]}>
                <Main.Input placeholder="Ej: 0981123456" maxLength={20} />
              </Main.Form.Item>
            </div>
          </div>

          {/* CONFIGURACIÓN */}
          <div className="form-section">
            <div className="section-title">Configuración</div>
            <div className="form-grid">
              <Main.Form.Item name="tip_empresa" label="Tipo de Empresa" rules={[{ required: true, message: 'Tipo es requerido' }]}>
                <Main.Select placeholder="Seleccione tipo">
                  <Option value="N">Nóminas</Option>
                  <Option value="B">Beneficiarios</Option>
                </Main.Select>
              </Main.Form.Item>
              <Main.Form.Item name="modalidad" label="Modalidad de Pago" rules={[{ required: true, message: 'Modalidad es requerida' }]}>
                <Main.Select placeholder="Seleccione modalidad">
                  <Option value="PRE">Prepago</Option>
                  <Option value="POS">Postpago</Option>
                </Main.Select>
              </Main.Form.Item>
              <Main.Form.Item
                name="limite_credito"
                label="Límite de Crédito"
                rules={[
                  { required: true, message: 'Límite requerido' },
                  { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' }
                ]}
                tooltip="Monto máximo de límite de crédito. Ingrese 0 para crédito ilimitado."
              >
                <Main.InputNumber
                  placeholder="0 = Ilimitado"
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `₲ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={value => value.replace(/₲\s?|(\.*)/g, '')}
                />
              </Main.Form.Item>

              <Main.Form.Item name="estado" label="Estado" valuePropName="checked">
                <Main.Switch checkedChildren="A" unCheckedChildren="I" />
              </Main.Form.Item>

              {permisos?.insert && (
                <Main.Form.Item
                  name="es_proveedor"
                  label={<span style={{ fontWeight: 600 }}>¿Es Entidad Otorgante de Créditos?</span>}
                  valuePropName="checked"
                  tooltip="Activar si esta empresa ofrece el servicio de crédito y confirmará solicitudes."
                >
                  <Main.Switch
                    checkedChildren={<MainIcon.CheckOutlined />}
                    unCheckedChildren={<MainIcon.CloseOutlined />}
                    disabled={config.disabled}
                  />
                </Main.Form.Item>
              )}
            </div>
          </div>

        </Main.Form>
      </div>

      <div className="empresa-modal-footer">
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

export default EmpresaModalView;