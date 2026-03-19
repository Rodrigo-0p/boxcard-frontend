import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import { formatCurrency, formatDate } from '../../../solicitud/data/solicitudesMock';

const ConfirmacionCardsView = ({
    solicitudes,
    loading,
    onConfirm,
    onReject
}) => {

    if (loading) {
        return <Main.SolicitudSkeletonGrid count={3} />;
    }

    if (solicitudes.length === 0) {
        return (
            <Main.Empty
                style={{ padding: '80px 0' }}
                description="No hay solicitudes pendientes de confirmación en este momento"
            />
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', padding: '20px 0' }}>
            {solicitudes.map((s) => (
                <ConfirmacionCardItem
                    key={s.cod_solicitud}
                    solicitud={s}
                    onConfirm={onConfirm}
                    onReject={onReject}
                />
            ))}
        </div>
    );
};

const ConfirmacionCardItem = ({ solicitud, onConfirm, onReject }) => {
    const s = solicitud;

    return (
        <Main.Card
            hoverable
            style={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                background: '#ffffff'
            }}
            styles={{ body: { padding: 0 } }}
        >
            {/* Header: Nro + Fecha + Estado */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#fffbeb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '13px', color: '#b45309', fontWeight: 600 }}>SOL-{s.nro_solicitud}</div>
                    <div style={{ fontSize: '11px', color: '#d97706' }}>{formatDate(s.fecha_creacion)}</div>
                </div>
                <Main.Tag icon={<MainIcon.FileSyncOutlined />} color="warning" style={{ borderRadius: '6px', fontWeight: 600, padding: '4px 10px', margin: 0, border: '1px solid #fcd34d' }}>
                    Pendiente a Confirmar
                </Main.Tag>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>

                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500 }}>Empresa Solicitante</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MainIcon.ShopOutlined style={{ color: '#0369a1' }} />
                        {s.nombre_empresa}
                    </div>
                </div>

                {s.nombre_empresa_destino && (
                    <div style={{ marginBottom: '16px', marginTop: '-8px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 500 }}>Proveedor Destino</div>
                        <div style={{ fontSize: '12px', color: '#0f766e', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MainIcon.BankOutlined /> {s.nombre_empresa_destino} <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>(ID: {s.cod_empresa_destino})</span>
                        </div>
                    </div>
                )}

                <Main.Row gutter={16} style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', margin: 0 }}>
                    <Main.Col span={14}>
                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 500 }}>Monto a Transferir</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MainIcon.MoneyCollectOutlined style={{ fontSize: '16px' }} />
                            {formatCurrency(s.monto_solicitado)}
                        </div>
                    </Main.Col>
                    <Main.Col span={10} style={{ textAlign: 'right', borderLeft: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 500 }}>Empleados</div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                            <MainIcon.TeamOutlined style={{ fontSize: '14px', color: '#3b82f6' }} />
                            {s.cant_beneficiarios}
                        </div>
                    </Main.Col>
                </Main.Row>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Main.Avatar size="small" style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '11px', fontWeight: 600 }}>
                            {Main.generateAbbreviation(s.solicitante_nombre || s.solicitante_username || 'U', 1)}
                        </Main.Avatar>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>{s.solicitante_nombre || s.solicitante_username}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <Main.Button
                    danger
                    icon={<MainIcon.CloseCircleOutlined />}
                    onClick={() => onReject(s)}
                    style={{ borderRadius: '6px', fontWeight: 500, marginRight: '8px' }}
                >
                    Rechazar
                </Main.Button>
                <Main.Button
                    type="primary"
                    icon={<MainIcon.CheckCircleOutlined />}
                    onClick={() => onConfirm(s)}
                    style={{ background: '#10b981', borderColor: '#10b981', borderRadius: '6px', fontWeight: 500, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                >
                    Confirmar Carga
                </Main.Button>
            </div>
        </Main.Card>
    );
};

export default ConfirmacionCardsView;
