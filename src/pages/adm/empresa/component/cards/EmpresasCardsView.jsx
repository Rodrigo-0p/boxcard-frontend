import * as React from 'react';
import MainIcon from '../../../../../util/mainIcon';
import Main     from '../../../../../util/main';


const EmpresasCardsView = ({  empresas
                            , loading
                            , onView
                            , onEdit
                            , onDelete
                            , permisos }) => {
  
  if (loading) {
    return (
      <div className="empresas-cards-grid">
        {Array.from({ length: empresas.length || 2 }).map((_, i) => (
          <Main.EmpresaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (empresas.length === 0) {
    return (
      <div className="cards-empty">
        <Main.Empty 
          description="No se encontraron empresas"
          image={Main.Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="empresas-cards-grid">
      {empresas.map((empresa) => (
        <EmpresaCard
          key       ={ empresa.cod_empresa  }
          empresa   ={ empresa  }
          onView    ={ onView   }
          onEdit    ={ onEdit   }
          onDelete  ={ onDelete }
          permisos  ={ permisos }
        />
      ))}
    </div>
  );
};

const EmpresaCard = ({ empresa, onView, onEdit, onDelete, permisos}) => {

  const userInitials = Main.generateAbbreviation(empresa.nombre);

  return (
    <Main.Card className="empresa-card-item" hoverable>

      {/* Header con Logo y Estado */}
      <div className="empresa-card-header">
        <Main.Space wrap size={14} style={{ cursor: 'pointer' }}>
          <Main.Avatar size={55} className="empresa-card-avatar">
            {userInitials}
          </Main.Avatar>
        </Main.Space>
        
          <Main.Tag color={empresa.estado === 'A' ? 'success' : 'red'} className="card-status">
            {empresa.estado === 'A' ? 'Activo' : 'Inactivo'}
          </Main.Tag>
      </div>

      {/* Información */}
      <div className="card-body">
        
        <h3 className="card-title">{empresa.nombre}</h3>
        
        <p className="card-info">
          <MainIcon.EnvironmentOutlined style={{marginRight:'5px'}}/>
          {empresa.direccion}
        </p>
        
        <p className="card-info">
          <MainIcon.MailOutlined style={{marginRight:'5px'}}/>
          {empresa.correo}
        </p>

        <p className="card-info">
          <MainIcon.PhoneOutlined style={{marginRight:'5px'}}/>
          {empresa.nro_telef}
        </p>

        <p className="card-ruc">RUC: {empresa.ruc}</p>
        
        <div className="card-tags">
          
          <Main.Tag color={`${empresa.tip_empresa === 'N' ? 'blue' : 'magenta'}`} className="card-tag-tipo">
            {empresa.tip_empresa === 'N' ? 'Nómina' : 'Beneficiario'}
          </Main.Tag>

          <Main.Tag color={`${empresa.modalidad === 'PRE' ? 'green' : 'gold'}`} className="card-tag-modalidad">
            {empresa.modalidad === 'PRE' ? 'Prepago' : 'Postpago'}
          </Main.Tag>

        </div>
      </div>

      {/* Footer con Acciones */}
      <div className="card-footer">
        <Main.Space size="small">
          
          <Main.Button disabled={!permisos.view} type="text" icon={<MainIcon.EyeOutlined />} onClick={() => onView(empresa)} className="card-btn-action">
            Ver
          </Main.Button>

          <Main.Button disabled={!permisos?.update} type="text" icon={<MainIcon.EditOutlined />} onClick={() => onEdit(empresa)} className="card-btn-action">
            Editar
          </Main.Button>

          <Main.Button disabled={!permisos.delete} type="text" icon={<MainIcon.DeleteOutlined />} onClick={() => onDelete(empresa)} danger className="card-btn-action">
            Eliminar
          </Main.Button>

        </Main.Space>
      </div>
    </Main.Card>
  );
};

export default EmpresasCardsView;