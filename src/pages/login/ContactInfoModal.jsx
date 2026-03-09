import * as React from 'react';
import { Modal, Spin } from 'antd';
import Main     from '../../util/main';
import MainIcon from '../../util/mainIcon';
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

  const copyText = (text)=> {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback para Safari / HTTP / navegadores viejos
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // evita scroll
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return Promise.resolve();
      } catch (err) {
        document.body.removeChild(textarea);
        return Promise.reject(err);
      }
    }
  }


  const copyToClipboard = (text,index)=>{
    copyText(text).then(() => {
      const CardElement   = document.querySelector(`.contact-info-item-${index}`);
      const CardValue     = document.querySelector(`.contact-info-value-${index}`);
      const originalValue = CardValue.textContent;

      CardValue.textContent        = '¡Copiado!';
      CardElement.style.background = 'linear-gradient(135deg, #ebfff5 0%, #6dbf99 100%)';

      setTimeout(() => {
        CardValue.textContent        = originalValue;
        CardElement.style.background = '';
      }, 1500);
    }).catch(() => {
      console.log('Advertencia, No se pudo copiar!!');
    });

    // navigator.clipboard.writeText(text).then(()=>{
    //   const CardElement   = document.querySelector(`.contact-info-item-${index}`);
    //   const CardValue     = document.querySelector(`.contact-info-value-${index}`);
    //   const originalValue = CardValue.textContent;

    //   CardValue.textContent         = '¡Copiado!';
    //   CardElement.style.background  = 'linear-gradient(135deg, #ebfff5 0%, #6dbf99 100%)';
      
    //   setTimeout(() => {
    //     CardValue.textContent         = originalValue;
    //     CardElement.style.background  = '';
    //   }, 1500);
    // })
  }

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
            <MainIcon.InfoCircleOutlined />
          </div>
          <div className="contact-modal-title-text">
            <h3>Soporte Técnico</h3>
            <p>Contacta con nosotros para ayuda</p>
          </div>
        </div>
        <button className="contact-modal-close" onClick={onClose}>
          <MainIcon.CloseOutlined />
        </button>
      </div>

      <div className="contact-modal-body">
        <div className="contact-alert">
          <MainIcon.InfoCircleOutlined className="contact-alert-icon" />
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
              <div onClick={()=>copyToClipboard(item.valor,index)} key={index} className={`contact-info-item contact-info-item-${index}`}>
                <div className="contact-info-icon">
                  {MainIcon.iconMap[item.icono] || <MainIcon.InfoCircleOutlined />}
                </div>
                <div className="contact-info-details">
                  <div className="contact-info-label">{item.etiqueta}</div>
                  <div className={`contact-info-value contact-info-value-${index}`}>{item.valor}</div>
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