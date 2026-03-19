import React, { useEffect, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import Main from '../../../util/main';
import MainUrl from '../solicitud/url/mainUrl';
import MainIcon from '../../../util/mainIcon';
import SimuladorBeneficios from './component/SimuladorBeneficios';
import '../solicitud/styles/SOLICITUD.css';

const cod_form = 1;

const ADM_DASHBOARD = () => {
    const menuProps = Main.useMenuNavigation(cod_form);
    const message = Main.useMessage();
    const { empresa: authEmpresa } = Main.useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const loadStats = async (showMsg = false) => {
        setLoading(true);
        try {
            const resp = await Main.Request('/bs/dashboard/stats', 'GET');
            if (resp.data.success) {
                setStats(resp.data.data);
                if (showMsg) message.success('Datos actualizados correctamente');
            } else {
                setStats({ limite_credito: 0, total_beneficiarios: 0 });
            }
        } catch (error) {
            console.error("Error loading dashboard stats:", error);
            setStats({ limite_credito: 0, total_beneficiarios: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats(false);
    }, []);

    return (
        <MainLayout {...menuProps}>
            <div style={{ padding: '0 24px 24px 24px' }}>
                {/* Header Section */}
                <div className="empresas-header" style={{ marginTop: '24px' }}>
                    <div className="header-left">
                        <h1 className="header-title">
                            <MainIcon.DashboardOutlined /> Panel de Control Operativo
                        </h1>
                        <div className="header-description">
                            {loading ? 'Consultando datos...' : (
                                <Main.Space split={<Main.Divider type="vertical" />} wrap>
                                    <span>Empresa: <b style={{ color: '#64748b', fontSize: '11px' }}>
                                        {Array.isArray(authEmpresa) ? authEmpresa[0]?.empresa : authEmpresa?.empresa || 'Sin Empresa'}
                                    </b></span>
                                    <span>RUC: <b style={{ color: '#64748b', fontSize: '11px' }}>
                                        {Array.isArray(authEmpresa) ? authEmpresa[0]?.ruc : authEmpresa?.ruc || '---'}
                                    </b></span>
                                </Main.Space>
                            )}
                        </div>
                    </div>
                    <div className="header-right">
                        <Main.Space>
                            <Main.Button
                                type="primary"
                                icon={<MainIcon.PlusOutlined />}
                                onClick={() => navigate('/solicitudes?action=new')}
                                className="btn-primary"
                            >
                                Nueva Solicitud
                            </Main.Button>
                            <Main.Button
                                icon={<MainIcon.ReloadOutlined spin={loading} />}
                                onClick={() => loadStats(true)}
                                loading={loading}
                                className="btn-icon-only"
                            />
                        </Main.Space>
                    </div>
                </div>

                {/* Top Summary Card - High Level Indicator */}
                <Main.Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
                    <Main.Col span={24}>
                        <Main.Card
                            bordered={false}
                            style={{
                                borderRadius: '20px',
                                background: 'linear-gradient(235deg, #5c6f8b, #002140)',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                                overflow: 'hidden',
                                position: 'relative',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05 }}>
                                <MainIcon.BankOutlined style={{ fontSize: '180px', color: '#ffffff' }} />
                            </div>
                            <Main.Row align="middle" gutter={[32, 32]}>
                                <Main.Col xs={24} md={10}>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                                        Límite de Crédito Institucional
                                    </div>
                                    <div style={{ color: '#ffffff', fontSize: '42px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1 }}>
                                        {Main.formatCurrency(stats?.limite_credito || 0)}
                                    </div>
                                </Main.Col>
                                <Main.Col xs={24} md={14}>
                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '160px', background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Monto Utilizado</div>
                                            <div style={{ color: '#ef4444', fontSize: '20px', fontWeight: 700 }}>{Main.formatCurrency(stats?.cupo_asignado || 0)}</div>
                                        </div>
                                        <div style={{ flex: 1, minWidth: '160px', background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Cupo Disponible</div>
                                            <div style={{ color: '#22c55e', fontSize: '20px', fontWeight: 700 }}>{Main.formatCurrency((stats?.limite_credito || 0) - (stats?.cupo_asignado || 0))}</div>
                                        </div>
                                    </div>
                                </Main.Col>
                            </Main.Row>
                        </Main.Card>
                    </Main.Col>
                </Main.Row>

                <Main.Row gutter={[24, 24]}>
                    <Main.Col xs={24} lg={15} xl={16}>
                        {/* Graphical Overview Area */}
                        <Main.Card
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                                    <MainIcon.BarChartOutlined style={{ color: '#0f172a' }} />
                                    <span style={{ fontWeight: 700 }}>Resumen de Gestión Operativa</span>
                                </div>
                            }
                            style={{ height: '100%', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}
                            bodyStyle={{ padding: '32px' }}
                        >
                            <Main.Row gutter={[32, 32]} align="middle">
                                <Main.Col xs={24} md={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        {/* SVG Donut Chart with Interactive Segments */}
                                        <div style={{ width: '200px', height: '200px', position: 'relative' }}>
                                            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                                                {(() => {
                                                    const total = stats?.total_solicitudes || 1;
                                                    const data = [
                                                        { count: stats?.count_confirmado || 0, color: '#10b981', label: 'Confirmadas' },
                                                        { count: stats?.count_pendiente || 0, color: '#f59e0b', label: 'Pendientes' },
                                                        { count: stats?.count_rechazado || 0, color: '#ef4444', label: 'Rechazadas' },
                                                        { count: stats?.count_borrador || 0, color: '#94a3b8', label: 'Borradores' }
                                                    ];

                                                    let currentAngle = 0;
                                                    return data.map((d, i) => {
                                                        if (d.count === 0) return null;

                                                        const angle = (d.count / total) * 360;
                                                        const largeArc = angle > 180 ? 1 : 0;

                                                        // Convert angles to radians and coordinates
                                                        const getCoords = (a) => ({
                                                            x: 50 + 40 * Math.cos(a * Math.PI / 180),
                                                            y: 50 + 40 * Math.sin(a * Math.PI / 180)
                                                        });

                                                        const start = getCoords(currentAngle);
                                                        const end = getCoords(currentAngle + angle);
                                                        const dPath = `M ${start.x} ${start.y} A 40 40 0 ${largeArc} 1 ${end.x} ${end.y}`;

                                                        currentAngle += angle;

                                                        return (
                                                            <Main.Tooltip key={i} title={`${d.label}: ${d.count}`} placement="top">
                                                                <path
                                                                    d={dPath}
                                                                    fill="none"
                                                                    stroke={d.color}
                                                                    strokeWidth="15"
                                                                    style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                                                                    onMouseEnter={(e) => e.target.setAttribute('stroke-width', '18')}
                                                                    onMouseLeave={(e) => e.target.setAttribute('stroke-width', '15')}
                                                                />
                                                            </Main.Tooltip>
                                                        );
                                                    });
                                                })()}
                                            </svg>
                                            {/* Inner label for the donut */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                pointerEvents: 'none'
                                            }}>
                                                <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{stats?.total_solicitudes || 0}</span>
                                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, textTransform: 'uppercase' }}>Total</span>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
                                                <span style={{ fontSize: '13px', color: '#475569' }}>Confirmadas: <b>{stats?.count_confirmado || 0}</b></span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b' }} />
                                                <span style={{ fontSize: '13px', color: '#475569' }}>Pendientes: <b>{stats?.count_pendiente || 0}</b></span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />
                                                <span style={{ fontSize: '13px', color: '#475569' }}>Rechazadas: <b>{stats?.count_rechazado || 0}</b></span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#94a3b8' }} />
                                                <span style={{ fontSize: '13px', color: '#475569' }}>Borradores: <b>{stats?.count_borrador || 0}</b></span>
                                            </div>
                                        </div>
                                    </div>
                                </Main.Col>
                                <Main.Col xs={24} md={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div 
                                            onClick={() => navigate('/beneficiarios')}
                                            style={{ cursor: 'pointer', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ background: '#e0f2fe', padding: '8px', borderRadius: '8px' }}>
                                                    <MainIcon.TeamOutlined style={{ color: '#0ea5e9', fontSize: '20px' }} />
                                                </div>
                                                <div>
                                                    <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>Beneficiarios Totales</div>
                                                    <div style={{ color: '#0f172a', fontSize: '20px', fontWeight: 700 }}>{stats?.total_beneficiarios || 0}</div>
                                                </div>
                                            </div>
                                            <MainIcon.ArrowRightOutlined style={{ color: '#cbd5e1' }} />
                                        </div>

                                        <div 
                                            onClick={() => navigate('/solicitudes')}
                                            style={{ cursor: 'pointer', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
                                                    <MainIcon.FileTextOutlined style={{ color: '#475569', fontSize: '20px' }} />
                                                </div>
                                                <div>
                                                    <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>Solicitudes Realizadas</div>
                                                    <div style={{ color: '#0f172a', fontSize: '20px', fontWeight: 700 }}>{stats?.total_solicitudes || 0}</div>
                                                </div>
                                            </div>
                                            <MainIcon.ArrowRightOutlined style={{ color: '#cbd5e1' }} />
                                        </div>

                                        <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '12px', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ background: '#d1fae5', padding: '8px', borderRadius: '8px' }}>
                                                    <MainIcon.CheckCircleOutlined style={{ color: '#10b981', fontSize: '20px' }} />
                                                </div>
                                                <div>
                                                    <div style={{ color: '#065f46', fontSize: '12px', fontWeight: 500 }}>Monto Total Confirmado</div>
                                                    <div style={{ color: '#065f46', fontSize: '20px', fontWeight: 700 }}>{Main.formatCurrency(stats?.monto_total_confirmado || 0)}</div>
                                                </div>
                                            </div>
                                            <div style={{ background: '#10b981', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>Finalizado</div>
                                        </div>
                                    </div>
                                </Main.Col>
                            </Main.Row>
                        </Main.Card>
                    </Main.Col>

                    <Main.Col xs={24} lg={9} xl={8}>
                        <SimuladorBeneficios
                            limiteProp={stats?.limite_credito || 0}
                            disponibleProp={(stats?.limite_credito || 0) - (stats?.cupo_asignado || 0)}
                            beneficiariosProp={stats?.total_beneficiarios || 0}
                        />
                    </Main.Col>
                </Main.Row>
            </div>
        </MainLayout>
    );
};

export default ADM_DASHBOARD;
