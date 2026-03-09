export const generateSecurePassword = (length = 12) => {
  // Caracteres seguros (sin ambiguos como 0/O, 1/l/I)
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnopqrstuvwxyz';
  const numbers   = '23456789';
  const symbols   = '!@#$%&*+=';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  // Asegurar al menos uno de cada tipo
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Completar con caracteres aleatorios
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mezclar la contraseña (Fisher-Yates shuffle)
  const passwordArray = password.split('');
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  
  return passwordArray.join('');
};

/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Al menos una mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Al menos una minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Al menos un número');
  }
  
  if (!/[!@#$%&*+=]/.test(password)) {
    errors.push('Al menos un símbolo (!@#$%&*+=)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordStrengthLevel = (password) => {
  if (!password) {
    return { level: 'Sin contraseña', score: 0, color: '#d9d9d9' };
  }
  
  let score = 0;
  
  // Longitud
  if (password.length >= 8)  score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 10;
  
  // Complejidad
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[!@#$%&*+=]/.test(password)) score += 10;
  
  // Variedad de caracteres
  const uniqueChars = new Set(password.split('')).size;
  if (uniqueChars >= 8) score += 10;
  
  if (score < 40) {
    return { level: 'Débil' , score, color: '#ff4d4f' };
  } else if (score < 70) {
    return { level: 'Media' , score, color: '#faad14' };
  } else {
    return { level: 'Fuerte', score, color: '#52c41a' };
  }
};

export default {
    generateSecurePassword
  , validatePasswordStrength
  , getPasswordStrengthLevel
};