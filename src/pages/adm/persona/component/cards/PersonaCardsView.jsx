import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';


const PersonaCardsView = ({ personas
  , loading
  , onView
  , onEdit
  , onDelete
  , permisos }) => {

  if (loading) {
    return (
      <div className="personas-cards-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <Main.EmpresaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="cards-empty">
        <Main.Empty
          description="No se encontraron personas"
          image={Main.Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="personas-cards-grid">
      {personas.map((persona) => (
        <PersonaCard
          key={persona.cod_persona}
          persona={persona}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          permisos={permisos}
        />
      ))}
    </div>
  );
};

const PersonaCard = ({ persona, onView, onEdit, onDelete, permisos }) => {

  const userInitials = Main.generateAbbreviation(persona.descripcion);

  return (
    <Main.Card className="persona-card-item" hoverable>

      {/* Header con Avatar y Estado */}
      <div className="persona-card-header">
        <Main.Space wrap size={14}>
          <Main.Avatar size={55} className="persona-card-avatar">
            {userInitials}
          </Main.Avatar>
        </Main.Space>

        <Main.Tag color={persona.estado === 'A' ? 'success' : 'red'} className="card-status">
          {persona.estado === 'A' ? 'Activo' : 'Inactivo'}
        </Main.Tag>
      </div>

      {/* Información */}
      <div className="card-body">

        <h3 className="card-title">{persona.descripcion}</h3>

        <p className="card-info">
          <MainIcon.IdcardOutlined style={{ marginRight: '5px' }} />
          {persona.nro_documento}
        </p>

        <p className="card-info">
          <MainIcon.PhoneOutlined style={{ marginRight: '5px' }} />
          {persona.nro_telef}
        </p>

        <p className="card-info">
          <MainIcon.MailOutlined style={{ marginRight: '5px' }} />
          {persona.correo}
        </p>

        <p className="card-empresa">
          <MainIcon.BankOutlined style={{ marginRight: '5px' }} />
          {persona.empresa_nombre}
        </p>

      </div>

      {/* Footer con Acciones */}
      <div className="card-footer">
        <Main.Space size="small">

          <Main.Button
            disabled={!permisos.view}
            type="text"
            icon={<MainIcon.EyeOutlined />}
            onClick={() => onView(persona)}
            className="card-btn-action"
          >
            Ver
          </Main.Button>

          <Main.Button
            disabled={!permisos?.update}
            type="text"
            icon={<MainIcon.EditOutlined />}
            onClick={() => onEdit(persona)}
            className="card-btn-action"
          >
            Editar
          </Main.Button>

          <Main.Button
            disabled={!permisos.delete}
            type="text"
            icon={<MainIcon.DeleteOutlined />}
            onClick={() => onDelete(persona)}
            danger
            className="card-btn-action"
          >
            Eliminar
          </Main.Button>

        </Main.Space>
      </div>
    </Main.Card>
  );
};

export default PersonaCardsView;