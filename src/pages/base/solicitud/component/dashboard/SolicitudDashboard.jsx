import React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const SolicitudDashboard = ({ data, stats, loading }) => {
    if (loading) return <Main.Skeleton active paragraph={{ rows: 1 }} />;
    
    return (
        <div style={{ marginBottom: 24 }}>
            {/* Fila Única: Información de Gestión de Crédito */}
            <Main.Row gutter={[16, 16]}>
                <Main.Col xs={24} sm={12} lg={6}>
                    <Main.Card bordered={false} style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <Main.Statistic 
                            title={<span style={{ color: '#64748b', fontWeight: 500 }}>Crédito Institucional</span>} 
                            value={Main.formatCurrency(data?.limite_credito || 0)} 
                            valueStyle={{ color: '#1e293b', fontWeight: 700, fontSize: '20px' }}
                            prefix={<MainIcon.BankOutlined style={{ color: '#0369a1' }} />}
                        />
                    </Main.Card>
                </Main.Col>
                <Main.Col xs={24} sm={12} lg={6}>
                    <Main.Card bordered={false} style={{ background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
                        <Main.Statistic 
                            title={<span style={{ color: '#166534', fontWeight: 500 }}>Monto Confirmado</span>} 
                            value={Main.formatCurrency(stats?.montoTotal || 0)} 
                            valueStyle={{ color: '#15803d', fontWeight: 700, fontSize: '20px' }}
                            prefix={<MainIcon.CheckCircleOutlined style={{ color: '#22c55e' }} />}
                        />
                    </Main.Card>
                </Main.Col>
                <Main.Col xs={24} sm={12} lg={6}>
                    <Main.Card bordered={false} style={{ background: '#eff6ff', borderRadius: 12, border: '1px solid #bfdbfe' }}>
                        <Main.Statistic 
                            title={<span style={{ color: '#1e40af', fontWeight: 500 }}>Saldo Disponible</span>} 
                            value={Main.formatCurrency((data?.limite_credito || 0) - (data?.cupo_asignado || 0))} 
                            valueStyle={{ color: '#1d4ed8', fontWeight: 700, fontSize: '20px' }}
                            prefix={<MainIcon.DollarOutlined style={{ color: '#3b82f6' }} />}
                        />
                    </Main.Card>
                </Main.Col>
                <Main.Col xs={24} sm={12} lg={6}>
                    <Main.Card bordered={false} style={{ background: '#fffbeb', borderRadius: 12, border: '1px solid #fde68a' }}>
                        <Main.Statistic 
                            title={<span style={{ color: '#92400e', fontWeight: 500 }}>Monto en Trámite</span>} 
                            value={Main.formatCurrency(stats?.montoPendiente || 0)} 
                            valueStyle={{ color: '#b45309', fontWeight: 700, fontSize: '20px' }}
                            prefix={<MainIcon.ClockCircleOutlined style={{ color: '#f59e0b' }} />}
                        />
                    </Main.Card>
                </Main.Col>
            </Main.Row>
        </div>
    );
};

export default SolicitudDashboard;
