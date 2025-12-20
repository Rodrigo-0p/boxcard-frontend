// components/administracion/persona/component/header/PersonaHeaderView.jsx

import * as React from 'react';
import Main       from '../../../../../util/main';
import MainIcon   from '../../../../../util/mainIcon';
import './PersonaHeader.css';

const PersonaHeaderView = React.memo(({ totalPersonas
                                      , onCreate
                                      , onRefresh
                                      , onExportar
                                      , loading  
                                      , permisos}) => {
  return (
    <div className="persona-header">

      <div className="header-left">
        <h1 className="header-title"><MainIcon.TeamOutlined/> Gestión de Persona / Usuario</h1>
        <p className="header-description">
          {loading 
            ? 'Cargando...'
            : `${totalPersonas} persona${totalPersonas !== 1 ? 's' : ''} registrada${totalPersonas !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      <div className="header-right">
        <Main.Space size="small">

          <Main.Button
            icon={<MainIcon.DownloadOutlined />}
            onClick={onExportar}
            className="btn-secondary"
          >
            Exportar
          </Main.Button>

          <Main.Button
            icon={<MainIcon.ReloadOutlined spin={loading} />}
            onClick={onRefresh}
            loading={loading}
            className="btn-icon-only"
          />

          <Main.Button
            type      = "primary"
            icon      = {<MainIcon.PlusOutlined />}
            onClick   = {onCreate}
            className = "btn-primary"
            disabled  = {!permisos?.insert}
          >
            Nueva Persona
          </Main.Button>
        </Main.Space>
      </div>

    </div>
  );
});

export default PersonaHeaderView;