import * as React from 'react';
import Main       from '../../../../../util/main'
import MainIcon   from '../../../../../util/mainIcon'

const EmpresaHeaderView = ({ totalEmpresas
                           , onNuevaEmpresa
                           , onRefresh
                           , onExportar
                           , loading  
                           , permisos}) => {
  return (
    <div className="empresas-header">
      
      <div className="header-left">
        <h1 className="header-title"><MainIcon.ShopOutlined/> Gestión de Empresa</h1>
        <p className="header-description">
          {loading 
            ? 'Cargando...'
            : `${totalEmpresas} empresa${totalEmpresas !== 1 ? 's' : ''} registrada${totalEmpresas !== 1 ? 's' : ''}`
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
            onClick   = {onNuevaEmpresa}
            className = "btn-primary"
            disabled  = {!permisos?.insert}
          >
            Nueva Empresa
          </Main.Button>
        </Main.Space>
      </div>
    </div>
  );
};

export default EmpresaHeaderView;