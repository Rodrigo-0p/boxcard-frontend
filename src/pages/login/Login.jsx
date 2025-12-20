import * as React       from 'react';
import Main             from '../../util/main'
import MainIcon         from '../../util/mainIcon'
import { useNavigate }  from 'react-router-dom';
import { useAuth }      from '../../context/AuthContext';
import ContactInfoModal from './ContactInfoModal';

import './styles.css'

const doct     = [{ required: true,
                    message: 'El documento es requerido'
                  }];
const pass     = [{ required: true,
                    message: 'La contraseña es requerida'
                  }];
const urlLogin          = '/public/login';

const Login = () => {
  const message = Main.useMessage();

  const [ form ]  = Main.Form.useForm();
  const { login,setLoading , loading } = useAuth();
  const [ showContactModal , setShowContactModal ] = React.useState(false);

  const navigate  = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const resp = await Main.Request(urlLogin, 'POST', values, message);
      if (resp.data && resp.data.success) {
        const resultado = await login(resp.data.datas);
        if (resultado.success) {
          navigate("/dashboard");
        }else{
          message.error(resultado.message);
        }
      } else {
        if (resp.data) message.error(resp.data.message);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log('Error en login:', err);
    }
  };
  const validateUsername = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('El usuario es requerido'));
    }
    if (value.length < 3) {
      return Promise.reject(new Error('El usuario debe tener al menos 3 caracteres'));
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
      return Promise.reject(new Error('El usuario solo puede contener letras, números, puntos, guiones y guiones bajos'));
    }
    return Promise.resolve();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="header-section">
          <div className="logo-circle">
            <MainIcon.UserOutlined />
          </div>
          <h1 className="title">Iniciar Sesión</h1>
          <p className="subtitle">Ingresa tus credenciales para acceder</p>
        </div>

        <Main.Form form={form} name="login" onFinish={onFinish} layout="vertical" size="large" autoComplete="off">

          <Main.Form.Item name="nro_documento" label="Número de Documento" rules={doct}>
            <Main.Input
              autoFocus
              prefix={<MainIcon.FileTextFilled />}
              placeholder="Ingresa tu número de documento"
            />
          </Main.Form.Item>

          <Main.Form.Item name="username" label="Usuario" rules={[{ validator: validateUsername }]}>
            <Main.Input
              prefix={<MainIcon.UserOutlined />}
              placeholder="Ingresa tu usuario"
              autoComplete="off"
            />
          </Main.Form.Item>

          <Main.Form.Item name="password" label="Contraseña" rules={pass}>
            <Main.Input.Password
              prefix={<MainIcon.LockFilled />}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              className="form-login-input"
              iconRender={(visible) =>
                visible ? <MainIcon.EyeFilled /> : <MainIcon.EyeInvisibleFilled />
              }
            />
          </Main.Form.Item>

          <Main.Form.Item className="submit-button-item">
            <Main.Button type="primary" htmlType="submit" loading={loading} block className={`login-button ${loading ? 'pulse' : ''}`}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Main.Button>
          </Main.Form.Item>
        </Main.Form>

        {/* Help Links */}
        <div className="divider">
          <span className="divider-text">¿Problemas para acceder?</span>
        </div>

        <div className="help-links">
          <a href="#" className="help-link" onClick={(e) => { e.preventDefault(); setShowContactModal(true) }}>
            Contactar soporte
          </a>
        </div>
      </div>
      
      <ContactInfoModal 
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
};

export default Login;