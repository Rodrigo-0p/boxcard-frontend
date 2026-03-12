import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import { generateSecurePassword, getPasswordStrengthLevel } from '../../../../../util/passwordgenerator';
import './Passwordfield.css';

const PasswordField = ({ 
  value, 
  onChange, 
  disabled = false,
  autoGenerate = true,
  label = "Contraseña"
}) => {
  const [showPassword , setShowPassword ] = React.useState(false);
  const [strength     , setStrength     ] = React.useState({ level: 'Sin contraseña', score: 0, color: '#d9d9d9' });
  const message = Main.useMessage();

  // Generar contraseña automáticamente al montar (si autoGenerate=true)
  React.useEffect(() => {
    if (autoGenerate && !value) {
      const newPassword = generateSecurePassword(12);
      onChange(newPassword);
    }
  }, [autoGenerate, value]);

  // Actualizar indicador de fortaleza cuando cambia la contraseña
  React.useEffect(() => {
    if (value) {
      const newStrength = getPasswordStrengthLevel(value);
      setStrength(newStrength);
    } else {
      setStrength({ level: 'Sin contraseña', score: 0, color: '#d9d9d9' });
    }
  }, [value]);

  const handleRegenerate = () => {
    const newPassword = generateSecurePassword(12);
    onChange(newPassword);
    message.success('Contraseña regenerada');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    message.success('Contraseña copiada al portapapeles');
  };

  const handleToggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-field-container">
      <div className="password-field-label">
        {label}
        <span className="password-strength-badge" style={{ backgroundColor: strength.color }}>
          {strength.level}
        </span>
      </div>
      
      <div className="password-field-input-group">
        <Main.Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej: Abc@1234"
          disabled={disabled}
          maxLength={100}
          className="password-field-input"
        />
        
        <div className="password-field-actions">
          <Main.Tooltip title={showPassword ? "Ocultar" : "Mostrar"}>
            <button 
              type="button"
              className="password-action-btn"
              onClick={handleToggleVisibility}
              disabled={disabled}
            >
              {showPassword ? <MainIcon.EyeInvisibleOutlined /> : <MainIcon.EyeOutlined />}
            </button>
          </Main.Tooltip>
          
          <Main.Tooltip title="Copiar">
            <button 
              type="button"
              className="password-action-btn"
              onClick={handleCopy}
              disabled={disabled || !value}
            >
              <MainIcon.CopyOutlined />
            </button>
          </Main.Tooltip>
          
          <Main.Tooltip title="Regenerar contraseña">
            <button 
              type="button"
              className="password-action-btn password-regenerate-btn"
              onClick={handleRegenerate}
              disabled={disabled}
            >
              <MainIcon.ReloadOutlined />
            </button>
          </Main.Tooltip>
        </div>
      </div>
      
      <div className="password-strength-bar">
        <div 
          className="password-strength-bar-fill"
          style={{ 
            width: `${strength.score}%`, 
            backgroundColor: strength.color 
          }}
        />
      </div>
      
      <div className="password-field-hint">
        Mínimo 8 caracteres: mayúscula, minúscula, número y símbolo
      </div>
    </div>
  );
};

export default PasswordField;