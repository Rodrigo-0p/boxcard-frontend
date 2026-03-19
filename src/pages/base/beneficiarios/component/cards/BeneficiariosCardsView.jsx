import * as React from 'react';
import MainIcon from '../../../../../util/mainIcon';
import Main from '../../../../../util/main';

const BeneficiariosCardsView = ({
    beneficiarios,
    loading,
    onView,
    onEdit,
    onDelete,
    onApprove,
    permisos
}) => {

    if (loading) {
        return <Main.BeneficiarioSkeletonGrid count={3} />;
    }

    if (beneficiarios.length === 0) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <Main.Empty
                    description="No se encontraron beneficiarios"
                    image={Main.Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div className="benef-cards-grid">
            {beneficiarios.map((b) => (
                <BeneficiarioCard
                    key={b.cod_beneficiario}
                    beneficiario={b}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onApprove={onApprove}
                    permisos={permisos}
                />
            ))}
        </div>
    );
};

/* ── Card individual optimizada ──────────────────────────── */
const BeneficiarioCard = ({ beneficiario, onView, onEdit, onDelete, onApprove, permisos }) => {
    const b = beneficiario;
    const initials = Main.generateAbbreviation(b.nombre_completo);

    return (
        <Main.Card
            className={`benef-card-item ${b.estado === 'I' ? 'inactivo' : ''}`}
            hoverable
            style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0' }}
        >
            <div className="benef-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Main.Avatar
                        size={48}
                        style={{
                            backgroundColor: b.estado === 'A' ? '#e6f7ff' : '#f5f5f5',
                            color: b.estado === 'A' ? '#1890ff' : '#8c8c8c',
                            fontWeight: 'bold',
                            border: '1px solid #d9d9d9'
                        }}
                    >
                        {initials}
                    </Main.Avatar>
                    <div className="benef-card-name">
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#262626' }}>{b.nombre_completo}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#8c8c8c' }}>
                            <MainIcon.IdcardOutlined style={{ marginRight: 4 }} />
                            CI/Documento: {b.nro_documento}
                        </p>
                        {b.ruc && (
                            <p style={{ margin: 0, fontSize: '13px', color: '#8c8c8c' }}>
                                <MainIcon.AuditOutlined style={{ marginRight: 4 }} />
                                RUC: {b.ruc}
                            </p>
                        )}
                    </div>
                </div>
                <Main.Tag
                    color={b.estado === 'A' ? 'success' : b.estado === 'P' ? 'processing' : 'default'}
                    style={{ borderRadius: '4px', margin: 0 }}
                >
                    {b.estado === 'A' ? 'Activo' : b.estado === 'P' ? 'Pendiente' : 'Inactivo'}
                </Main.Tag>
            </div>

            <div className="benef-card-body" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#595959' }}>
                        <MainIcon.PhoneOutlined style={{ color: '#8c8c8c' }} />
                        <span>{b.nro_telef || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#595959' }}>
                        <MainIcon.MailOutlined style={{ color: '#8c8c8c' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {b.correo || '—'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#595959' }}>
                        <MainIcon.DollarOutlined style={{ color: '#8c8c8c' }} />
                        <span style={{ fontWeight: 500, color: b.monto_limite > 0 ? '#1890ff' : '#8c8c8c' }}>
                            ₲ {b.monto_limite > 0
                                ? Number(b.monto_limite).toLocaleString('es-PY')
                                : 'Sin límite'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="card-footer" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                <Main.Space size="small">
                    {b.estado === 'P' && (
                        <Main.Button type="text" icon={<MainIcon.CheckCircleOutlined />} onClick={() => onApprove(b.cod_beneficiario)} className="card-btn-action" style={{ color: '#1890ff' }}>
                            Aprobar
                        </Main.Button>
                    )}

                    <Main.Button type="text" icon={<MainIcon.EyeOutlined />} onClick={() => onView(b)} className="card-btn-action">
                        Ver
                    </Main.Button>

                    <Main.Button disabled={!permisos?.update} type="text" icon={<MainIcon.EditOutlined />} onClick={() => onEdit(b)} className="card-btn-action">
                        Editar
                    </Main.Button>

                    <Main.Button disabled={!permisos?.delete} type="text" danger icon={<MainIcon.DeleteOutlined />} onClick={() => onDelete(b)} className="card-btn-action">
                        Eliminar
                    </Main.Button>
                </Main.Space>
            </div>
        </Main.Card>
    );
};

export default BeneficiariosCardsView;
