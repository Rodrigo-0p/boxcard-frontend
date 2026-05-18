import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const UsuarioCards = ({ usuarios
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

    if (usuarios.length === 0) {
        return (
            <div className="cards-empty">
                <Main.Empty
                    description="No se encontraron usuarios"
                    image={Main.Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div className="personas-cards-grid">
            {usuarios.map((usuario) => (
                <UsuarioCard
                    key={usuario.cod_persona}
                    usuario={usuario}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    permisos={permisos}
                />
            ))}
        </div>
    );
};

const UsuarioCard = ({ usuario, onView, onEdit, onDelete, permisos }) => {

    const userInitials = Main.generateAbbreviation(usuario.descripcion);

    const getRolTag = (rol) => {
        const roleConfig = {
            rol_super_adm: { color: 'purple', text: 'Super Admin' },
            rol_adm: { color: 'blue', text: 'Admin' },
            rol_cliente: { color: 'green', text: 'Cliente Admin' },
            rol_usuario: { color: 'orange', text: 'Usuario Admin' },
            rol_consulta: { color: 'yellow', text: 'Consulta Admin' }
        };
        const config = roleConfig[rol] || { color: 'default', text: rol || 'Sin Rol' };
        return { color: config.color, text: config.text };
    };

    const rolInfo = getRolTag(usuario.rol_principal);
    const hasAccess = !!usuario.usuario_pg;

    return (
        <Main.Card className="persona-card-item" hoverable>
            <div className="persona-card-header">
                <Main.Avatar size={55} className="persona-card-avatar" style={{ background: hasAccess ? '#001529' : '#d9d9d9' }}>
                    {userInitials}
                </Main.Avatar>

                <Main.Tag color={hasAccess ? 'success' : 'warning'} className="card-status">
                    {hasAccess ? 'Con Acceso' : 'Sin Acceso'}
                </Main.Tag>
            </div>

            <div className="card-body">
                <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 2 }}>Persona Asignada</span>
                    <h3 className="card-title" style={{ margin: 0, color: '#262626' }}>{usuario.descripcion}</h3>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 2 }}>Acceso al Sistema</span>

                    {hasAccess ? (
                        <p className="card-info" style={{ marginBottom: 4 }}>
                            <MainIcon.UserOutlined style={{ marginRight: '5px', color: '#1890ff' }} />
                            <span style={{ fontWeight: 500 }}>{usuario.usuario_pg}</span>
                        </p>
                    ) : (
                        <p className="card-info" style={{ color: '#faad14', marginBottom: 4 }}>
                            <MainIcon.ExclamationCircleOutlined style={{ marginRight: '5px' }} />
                            Acceso no configurado
                        </p>
                    )}

                    <p className="card-info" style={{ marginBottom: 0 }}>
                        <MainIcon.IdcardOutlined style={{ marginRight: '5px' }} />
                        {usuario.nro_documento}
                    </p>
                </div>

                <div className="card-tags">
                    {hasAccess ? (
                        <Main.Tag color={rolInfo.color} className="card-tag-rol">
                            {rolInfo.text}
                        </Main.Tag>
                    ) : (
                        <Main.Tag>Sin Rol</Main.Tag>
                    )}
                </div>
            </div>

            <div className="card-footer">
                <Main.Space size="small">
                    {hasAccess ? (
                        <>
                            <Main.Button
                                type="text"
                                icon={<MainIcon.EyeOutlined />}
                                onClick={() => onView(usuario)}
                                className="card-btn-action"
                            >
                                Ver
                            </Main.Button>
                            <Main.Button
                                type="text"
                                icon={<MainIcon.EditOutlined />}
                                onClick={() => onEdit(usuario)}
                                className="card-btn-action"
                            >
                                Editar
                            </Main.Button>
                            <Main.Button
                                type="text"
                                icon={<MainIcon.DeleteOutlined />}
                                onClick={() => onDelete(usuario)}
                                danger
                                className="card-btn-action"
                            >
                                Quitar
                            </Main.Button>
                        </>
                    ) : (
                        <Main.Button
                            type="primary"
                            icon={<MainIcon.PlusOutlined />}
                            onClick={() => onEdit(usuario)} // Edit para crear acceso
                            style={{ background: '#001529' }}
                        >
                            Configurar Acceso
                        </Main.Button>
                    )}
                </Main.Space>
            </div>
        </Main.Card>
    );
};

export default UsuarioCards;
