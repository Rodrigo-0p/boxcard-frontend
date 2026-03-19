import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const SolicitudCards = ({
    solicitudes,
    loading,
    onView,
    onEdit,
    onDelete,
    onSend,
    onApprove,
    onReject,
    permisos
}) => {

    if (loading && solicitudes.length === 0) {
        return <Main.SolicitudSkeletonGrid count={3} />;
    }

    if (solicitudes.length === 0 && !loading) {
        return (
            <Main.Empty
                style={{ padding: '80px 0' }}
                description="No se encontraron solicitudes de carga"
            />
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', padding: '20px 0' }}>
            {solicitudes.map((s) => (
                <SolicitudCardItem
                    key={s.cod_solicitud}
                    solicitud={s}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onSend={onSend}
                    onApprove={onApprove}
                    onReject={onReject}
                    permisos={permisos}
                />
            ))}
        </div>
    );
};

const SolicitudCardItem = ({ solicitud, onView, onEdit, onDelete, onSend, onApprove, onReject, permisos }) => {
    const s = solicitud;
    const config = Main.estadosSolicitud[s.estado] || { color: 'default', text: s.estado, icon: 'QuestionCircleOutlined' };
    const Icon = MainIcon[config.icon];

    const isBorrador = s.estado === 'B';
    const isPendiente = s.estado === 'P';

    return (
        <Main.Card
            hoverable
            style={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                opacity: s.estado === 'A' ? 0.6 : 1
            }}
            styles={{ body: { padding: 0 } }}
        >
            {/* Header: Nro + Fecha + Estado */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>SOL-{s.nro_solicitud}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{Main.formatDate(s.fecha_creacion)}</div>
                </div>
                <Main.Tag icon={Icon ? <Icon /> : null} color={config.color} style={{ borderRadius: '6px', fontWeight: 600, padding: '2px 10px', margin: 0 }}>
                    {config.text}
                </Main.Tag>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Descripción</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.descripcion || 'Sin descripción'}
                    </div>
                </div>

                {s.nombre_empresa_destino && (
                    <div style={{ marginBottom: '16px', marginTop: '-8px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Proveedor Destino</div>
                        <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MainIcon.BankOutlined /> {s.nombre_empresa_destino} <span style={{ fontSize: '10px', color: '#94a3b8' }}>(ID: {s.cod_empresa_destino})</span>
                        </div>
                    </div>
                )}

                <Main.Row gutter={16} style={{ background: '#f1f5f9', borderRadius: '8px', padding: '12px', margin: 0 }}>
                    <Main.Col span={14}>
                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Monto Solicitado</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MainIcon.DollarOutlined style={{ color: '#059669', fontSize: '14px' }} />
                            {Main.formatCurrency(s.monto_solicitado)}
                        </div>
                    </Main.Col>
                    <Main.Col span={10} style={{ textAlign: 'right', borderLeft: '1px solid #cbd5e1' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Empleados</div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <MainIcon.UserOutlined style={{ fontSize: '14px', color: '#1890ff' }} />
                            {s.cant_beneficiarios}
                        </div>
                    </Main.Col>
                </Main.Row>

                {s.estado === 'C' && s.nro_comprobante && (
                    <div style={{ marginTop: '12px', padding: '8px 12px', background: '#ecfdf5', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MainIcon.FileDoneOutlined style={{ color: '#059669' }} />
                        <div style={{ fontSize: '11px', color: '#065f46' }}>
                            Comprobante: <b>{s.nro_comprobante}</b>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Main.Avatar size="small" style={{ backgroundColor: '#1890ff', fontSize: '10px' }}>
                            {Main.generateAbbreviation(s.solicitante_nombre || s.solicitante_username || 'U', 1)}
                        </Main.Avatar>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{s.solicitante_nombre || s.solicitante_username}</span>
                            {s.solicitante_nombre && s.solicitante_username && (
                                <span style={{ fontSize: '10px', color: '#94a3b8' }}>@{s.solicitante_username}</span>
                            )}
                        </div>
                    </div>
                    {s.tip_empresa && (
                        <Main.Tag color={s.tip_empresa === 'NOMINA' ? 'purple' : 'cyan'} style={{ fontSize: '10px', border: 'none' }}>
                            {s.tip_empresa}
                        </Main.Tag>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '12px 20px', background: '#fdfdfd', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
                <Main.Tooltip title="Ver Detalle">
                    <Main.Button
                        size="small"
                        icon={<MainIcon.EyeOutlined style={{ color: '#475569' }} />}
                        onClick={() => onView(s)}
                    />
                </Main.Tooltip>

                {isBorrador && (
                    <>
                        <Main.Tooltip title="Editar Solicitud">
                            <Main.Button
                                size="small"
                                icon={<MainIcon.EditOutlined style={{ color: '#475569' }} />}
                                onClick={() => onEdit(s)}
                            />
                        </Main.Tooltip>
                        <Main.Tooltip title="Eliminar Borrador">
                            <Main.Button
                                size="small"
                                danger
                                icon={<MainIcon.DeleteOutlined />}
                                onClick={() => onDelete(s)}
                            />
                        </Main.Tooltip>
                        <div style={{ flex: 1 }} />
                        <Main.Button
                            size="small"
                            type="primary"
                            icon={<MainIcon.SendOutlined />}
                            onClick={() => onSend(s.cod_solicitud)}
                            style={{ borderRadius: '6px', fontSize: '12px' }}
                        >
                            Enviar
                        </Main.Button>
                    </>
                )}

                {isPendiente && (
                    <>
                        <Main.Tooltip title="Anular / Cancelar">
                            <Main.Button
                                size="small"
                                danger
                                icon={<MainIcon.StopOutlined />}
                                onClick={() => onDelete(s)}
                            />
                        </Main.Tooltip>
                        <div style={{ flex: 1 }} />
                        <Main.Tag color="orange" icon={<MainIcon.ClockCircleOutlined />} style={{ margin: 0, padding: '4px 8px', fontSize: '10px' }}>
                            En espera
                        </Main.Tag>
                    </>
                )}
            </div>
        </Main.Card>
    );
};

export default SolicitudCards;
