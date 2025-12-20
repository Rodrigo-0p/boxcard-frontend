import * as React from 'react';
import { Modal, Spin } from 'antd';
import { MailOutlined       , PhoneOutlined, 
         WhatsAppOutlined   , ClockCircleOutlined,
         InfoCircleOutlined , CloseOutlined  } from '@ant-design/icons';
import Main    from '../../util/main';
import './ContactInfoModal.css';

const url_info_contacto = '/public/info-contacto';


const ContactInfoModal = ({ visible, onClose }) => {

  const [contactInfo , setContactInfo] = React.useState([]);
  const [loading     , setLoading    ] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      loadContactInfo();
    }
  }, [visible]);

  const loadContactInfo = async () => {
    setLoading(true);
    try {
      const response = await Main.Request(url_info_contacto, 'GET');
      if (response.data.success) {
        setContactInfo(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando info contacto:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (tipo) => {
    const icons = {
      email    : <MailOutlined />,
      telefono : <PhoneOutlined />,
      whatsapp : <WhatsAppOutlined />,
      horario  : <ClockCircleOutlined />
    };
    return icons[tipo] || <InfoCircleOutlined />;
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={500}
      centered
      className="contact-info-modal"
    >
      <div className="contact-modal-header">
        <div className="contact-modal-title-section">
          <div className="contact-modal-icon">
            <InfoCircleOutlined />
          </div>
          <div className="contact-modal-title-text">
            <h3>Soporte Técnico</h3>
            <p>Contacta con nosotros para ayuda</p>
          </div>
        </div>
        <button className="contact-modal-close" onClick={onClose}>
          <CloseOutlined />
        </button>
      </div>

      <div className="contact-modal-body">
        <div className="contact-alert">
          <InfoCircleOutlined className="contact-alert-icon" />
          <div>
            <strong>¿Necesitas ayuda?</strong>
            <p>Nuestro equipo está disponible para asistirte con cualquier problema.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin />
          </div>
        ) : (
          <div className="contact-info-list">
            {contactInfo.map((item, index) => (
              <div key={index} className="contact-info-item">
                <div className="contact-info-icon">
                  {getIcon(item.tipo)}
                </div>
                <div className="contact-info-details">
                  <div className="contact-info-label">{item.etiqueta}</div>
                  <div className="contact-info-value">{item.valor}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="contact-instructions">
          <div className="contact-instructions-title">Para restablecer tu contraseña:</div>
          <ol>
            <li>Contacta a soporte por email o WhatsApp</li>
            <li>Proporciona tu número de documento y usuario</li>
            <li>El equipo verificará tu identidad</li>
            <li>Recibirás una nueva contraseña temporal</li>
          </ol>
        </div>
      </div>

      <div className="contact-modal-footer">
        <button className="btn-contact-primary" onClick={onClose}>
          Entendido
        </button>
      </div>
    </Modal>
  );
};

export default ContactInfoModal;