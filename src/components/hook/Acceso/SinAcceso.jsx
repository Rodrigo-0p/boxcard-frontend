import * as React from 'react';
import { Result } from 'antd';
import MainIcon   from '../../../util/mainIcon';
import './SinAcceso.css';

const SinAcceso = React.memo(({ titulo = "Sin Acceso", mensaje = "No tienes permisos para ver este contenido" }) => {
  return (
    <div className="sin-acceso-container">
      <Result
        icon={<MainIcon.LockOutlined className="sin-acceso-icon" />}
        title={titulo}
        subTitle={mensaje}
        extra={
          <div className="sin-acceso-info">
            <p>Contacta a tu administrador para solicitar acceso</p>
          </div>
        }
      />
    </div>
  );
});

export default SinAcceso;