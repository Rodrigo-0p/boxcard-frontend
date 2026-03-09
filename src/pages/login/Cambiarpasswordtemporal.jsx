import * as React from 'react';
import Main       from '../../util/main';
import MainIcon   from '../../util/mainIcon';
import { getPasswordStrengthLevel } from '../../util/passwordgenerator';
import './Cambiarpasswordtemporal.css';

const CambiarPasswordTemporal = ({ visible, usuario, empresa, onClose, onSuccess }) => {
  
  const [loading, setLoading] = React.useState(false);
  const [passwordActual, setPasswordActual] = React.useState('');
  const [passwordNueva, setPasswordNueva] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [strength, setStrength] = React.useState({ level: 'Sin contraseña', score: 0, color: '#d9d9d9' });
  
  const message = Main.useMessage();

  // Resetear formulario al cerrar
  React.useEffect(() => {
    if (!visible) {
      setPasswordActual('');
      setPasswordNueva('');
      setPasswordConfirm('');
      setStrength({ level: 'Sin contraseña', score: 0, color: '#d9d9d9' });
    }
  }, [visible]);

  // Calcular fortaleza de contraseña nueva
  React.useEffect(() => {
    if (passwordNueva) {
      const newStrength = getPasswordStrengthLevel(passwordNueva);
      setStrength(newStrength);
    } else {
      setStrength({ level: 'Sin contraseña', score: 0, color: '#d9d9d9' });
    }
  }, [passwordNueva]);

  const handleSubmit = async () => {
    try {
      // Validaciones
      if (!passwordActual || passwordActual.trim() === '') {
        message.warning('Debes ingresar tu contraseña actual');
        return;
      }

      if (!passwordNueva || passwordNueva.trim() === '') {
        message.warning('Debes ingresar una nueva contraseña');
        return;
      }

      if (passwordNueva.length < 8) {
        message.warning('La nueva contraseña debe tener al menos 8 caracteres');
        return;
      }

      // Validar fortaleza
      if (strength.level === 'Débil') {
        message.warning('La contraseña es demasiado débil. Debe tener al menos nivel "Medio"');
        return;
      }

      if (!passwordConfirm || passwordConfirm.trim() === '') {
        message.warning('Debes confirmar la nueva contraseña');
        return;
      }

      if (passwordNueva !== passwordConfirm) {
        message.error('Las contraseñas no coinciden');
        return;
      }

      if (passwordActual === passwordNueva) {
        message.warning('La nueva contraseña debe ser diferente a la actual');
        return;
      }

      setLoading(true);

      // Llamar al callback para enviar al backend
      if (onSuccess) {
        await onSuccess({
          passwordActual,
          passwordNueva
        });
      }

    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      message.error(error.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="cambiar-password-modal-overlay">
      {/* Modal container */}
      <div className="cambiar-password-modal">
        
        {/* Header simple con título */}
        <div className="modal-header">
          <h1 className="modal-title">Actualización de Credenciales de Acceso</h1>
           <button 
              className="modal-close-button" 
              onClick={onClose}
              disabled={loading}
            >
            <MainIcon.CloseOutlined />
          </button>
        </div>

        {/* Contenido - 2 columnas sin scroll */}
        <div className="modal-content">
          
          {/* Columna izquierda - Información */}
          <div className="modal-info-column">
            
            {/* Card de usuario */}
            <div className="info-card user-card">
              <div className="card-icon">
                <MainIcon.UserOutlined />
              </div>
              <div className="card-content">
                <div className="card-label">Usuario</div>
                <div className="card-value">{usuario}</div>
              </div>
            </div>

            {/* Card de empresa */}
            {empresa && (
              <div className="info-card company-card">
                <div className="card-icon">
                  <MainIcon.BankOutlined />
                </div>
                <div className="card-content">
                  <div className="card-label">Empresa</div>
                  <div className="card-value">{empresa.empresa}</div>
                  <div className="card-extra">{empresa.ruc}</div>
                </div>
              </div>
            )}

            {/* Alerta de seguridad */}
            <div className="security-alert">
              <div className="alert-icon">
                <MainIcon.ExclamationCircleOutlined />
              </div>
              <div className="alert-content">
                <h3>Contraseña Temporal</h3>
                <p>Tu contraseña actual es temporal y debe ser actualizada.</p>
              </div>
            </div>

            {/* Requisitos de seguridad */}
            <div className="security-requirements">
              <div className="requirements-header">
                <MainIcon.SafetyOutlined />
                <span>Requisitos de Seguridad</span>
              </div>
              <ul className="requirements-list">
                <li className={passwordNueva.length >= 8 ? 'requirement-valid' : 'requirement-pending'}>
                  <span className="requirement-icon">
                    {passwordNueva.length >= 8 ? '✓' : '○'}
                  </span>
                  <span>Mínimo 8 caracteres</span>
                </li>
                <li className={/[A-Z]/.test(passwordNueva) ? 'requirement-valid' : 'requirement-pending'}>
                  <span className="requirement-icon">
                    {/[A-Z]/.test(passwordNueva) ? '✓' : '○'}
                  </span>
                  <span>Una letra mayúscula</span>
                </li>
                <li className={/[a-z]/.test(passwordNueva) ? 'requirement-valid' : 'requirement-pending'}>
                  <span className="requirement-icon">
                    {/[a-z]/.test(passwordNueva) ? '✓' : '○'}
                  </span>
                  <span>Una letra minúscula</span>
                </li>
                <li className={/[0-9]/.test(passwordNueva) ? 'requirement-valid' : 'requirement-pending'}>
                  <span className="requirement-icon">
                    {/[0-9]/.test(passwordNueva) ? '✓' : '○'}
                  </span>
                  <span>Un número</span>
                </li>
                <li className={/[^A-Za-z0-9]/.test(passwordNueva) ? 'requirement-valid' : 'requirement-pending'}>
                  <span className="requirement-icon">
                    {/[^A-Za-z0-9]/.test(passwordNueva) ? '✓' : '○'}
                  </span>
                  <span>Un símbolo (@, #, $, etc.)</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Columna derecha - Formulario */}
          <div className="modal-form-column">
            
            <div className="form-container">
              
              {/* Contraseña Actual */}
              <div className="form-group">
                <label className="form-label">
                  <span>Contraseña Actual</span>
                </label>
                <div className="input-wrapper">
                  <Main.Input.Password
                    size="large"
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    placeholder="Ingresa tu contraseña temporal"
                    disabled={loading}
                    maxLength={100}
                    iconRender={(visible) => 
                      visible ? <MainIcon.EyeOutlined /> : <MainIcon.EyeInvisibleOutlined />
                    }
                  />
                </div>
              </div>

              {/* Separador visual */}
              <div className="form-divider">
                <span>Nueva Contraseña</span>
              </div>

              {/* Nueva Contraseña */}
              <div className="form-group">
                <label className="form-label">
                  <span>Nueva Contraseña</span>
                  <span 
                    className="strength-badge" 
                    style={{ backgroundColor: strength.color }}
                  >
                    {strength.level}
                  </span>
                </label>
                <div className="input-wrapper">
                  <Main.Input.Password
                    size="large"
                    value={passwordNueva}
                    onChange={(e) => setPasswordNueva(e.target.value)}
                    placeholder="Ingresa tu nueva contraseña"
                    disabled={loading}
                    maxLength={100}
                    iconRender={(visible) => 
                      visible ? <MainIcon.EyeOutlined /> : <MainIcon.EyeInvisibleOutlined />
                    }
                  />
                </div>
                
                {/* Barra de fortaleza */}
                <div className="strength-bar">
                  <div 
                    className="strength-bar-fill"
                    style={{ 
                      width: `${strength.score}%`, 
                      backgroundColor: strength.color 
                    }}
                  />
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="form-group">
                <label className="form-label">
                  <span>Confirmar Nueva Contraseña</span>
                </label>
                <div className="input-wrapper">
                  <Main.Input.Password
                    size="large"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirma tu nueva contraseña"
                    disabled={loading}
                    maxLength={100}
                    iconRender={(visible) => 
                      visible ? <MainIcon.EyeOutlined /> : <MainIcon.EyeInvisibleOutlined />
                    }
                  />
                </div>
                
                {/* Indicador de coincidencia */}
                {passwordConfirm && (
                  <div className="password-match-indicator">
                    {passwordNueva === passwordConfirm ? (
                      <div className="match-success">
                        <MainIcon.CheckCircleOutlined />
                        <span>Las contraseñas coinciden</span>
                      </div>
                    ) : (
                      <div className="match-error">
                        <MainIcon.CloseCircleOutlined />
                        <span>Las contraseñas no coinciden</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón de submit */}
              <div className="form-actions">
                <Main.Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  onClick={handleSubmit}
                  icon={<MainIcon.CheckOutlined />}
                  className="submit-button"
                >
                  Cambiar Contraseña y Continuar
                </Main.Button>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <MainIcon.InfoCircleOutlined /> 
          Tu contraseña será cifrada de forma segura
        </div>

      </div>
    </div>
  );
};

export default CambiarPasswordTemporal;