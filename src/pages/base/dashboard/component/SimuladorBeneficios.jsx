import React, { useState, useEffect } from 'react';
import Main from '../../../../util/main';
import MainIcon from '../../../../util/mainIcon';

const SimuladorBeneficios = ({ limiteProp = 0, disponibleProp = 0, beneficiariosProp = 0 }) => {
    const [personas, setPersonas] = useState(10);
    const [montoTotal, setMontoTotal] = useState(0);
    const [limiteEmpresa, setLimiteEmpresa] = useState(45000000);
    const [cupoDisponible, setCupoDisponible] = useState(0);

    // Initial setup from props
    useEffect(() => {
        setLimiteEmpresa(limiteProp > 0 ? limiteProp : 45000000);
        setCupoDisponible(disponibleProp);
        // Default to 10 people if the API returns 0 beneficiaries to allow the simulator to work
        setPersonas(beneficiariosProp > 0 ? beneficiariosProp : 10);
    }, [limiteProp, disponibleProp, beneficiariosProp]);

    const asignacionPorPersona = React.useMemo(() => {
        return personas > 0 ? montoTotal / personas : 0;
    }, [montoTotal, personas]);

    const handleSimulatorChange = (value) => {
        setMontoTotal(value);
    };

    return (
        <Main.Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MainIcon.CalculatorOutlined style={{ color: '#0f172a' }} />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Simulador de Distribución de Crédito</span>
                </div>
            }
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            styles={{ body: { padding: '24px', background: '#f8fafc' } }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Available Credit Limit Display */}
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cupo Disponible Real</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MainIcon.BankOutlined style={{ color: '#0284c7', fontSize: '18px' }} />
                            {Main.formatCurrency(cupoDisponible)}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Límite Total</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>{Main.formatCurrency(limiteEmpresa)}</div>
                    </div>
                </div>

                {/* Number of Collaborators Slider */}
                <div style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'all 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MainIcon.TeamOutlined style={{ color: '#0284c7', fontSize: '16px' }} />
                            </div>
                            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Cant. de Colaboradores</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px' }}>{personas}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Personas</div>
                        </div>
                    </div>
                    <Main.Slider
                        min={1}
                        max={Math.max(beneficiariosProp, 20)}
                        step={1}
                        value={personas}
                        onChange={(val) => setPersonas(val)}
                        trackStyle={{ backgroundColor: '#38bdf8', height: 8, borderRadius: '4px' }}
                        handleStyle={{
                            borderColor: '#38bdf8',
                            backgroundColor: '#ffffff',
                            width: '12px',
                            height: '24px',
                            borderRadius: '6px',
                            marginTop: -8,
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                            border: '2px solid #38bdf8',
                            zIndex: 2
                        }}
                        railStyle={{ backgroundColor: '#f1f5f9', height: 8, borderRadius: '4px' }}
                    />
                    {personas > beneficiariosProp && beneficiariosProp > 0 && (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '11px', fontWeight: 600 }}>
                            <MainIcon.WarningOutlined /> Supera los {beneficiariosProp} beneficiarios registrados
                        </div>
                    )}
                </div>

                {/* Amount to Distribute Slider */}
                <div style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'all 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MainIcon.DollarOutlined style={{ color: '#059669', fontSize: '16px' }} />
                            </div>
                            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Monto a Distribuir</span>
                            <Main.Tooltip title={`Cupo máximo disponible para distribuir: ${Main.formatCurrency(cupoDisponible)}`}>
                                <MainIcon.InfoCircleOutlined style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }} />
                            </Main.Tooltip>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px' }}>{Main.formatCurrency(montoTotal)}</div>
                            <Main.Button 
                                type="text" 
                                size="small" 
                                style={{ fontSize: '10px', color: '#059669', padding: '0 4px', height: '20px' }}
                                icon={<MainIcon.ThunderboltOutlined />}
                                onClick={() => {
                                    setMontoTotal(cupoDisponible);
                                    if (beneficiariosProp > 0) setPersonas(beneficiariosProp);
                                }}
                            >
                                Distribuir todo
                            </Main.Button>
                        </div>
                    </div>

                    <Main.Slider
                        min={0}
                        max={Math.max(limiteEmpresa, cupoDisponible)}
                        step={100000}
                        value={montoTotal}
                        onChange={handleSimulatorChange}
                        tooltip={{ formatter: (value) => Main.formatCurrency(value) }}
                        marks={{
                            [cupoDisponible]: {
                                style: { color: '#ef4444', fontSize: '10px', fontWeight: 700 },
                                label: 'Límite',
                            }
                        }}
                        trackStyle={{ backgroundColor: montoTotal > cupoDisponible ? '#ef4444' : '#10b981', height: 8, borderRadius: '4px' }}
                        handleStyle={{ 
                            borderColor: montoTotal > cupoDisponible ? '#ef4444' : '#10b981', 
                            backgroundColor: '#ffffff', 
                            width: '12px', 
                            height: '24px', 
                            borderRadius: '6px',
                            marginTop: -8, 
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                            border: '2px solid' + (montoTotal > cupoDisponible ? '#ef4444' : '#10b981'),
                            zIndex: 2
                        }}
                        railStyle={{ backgroundColor: '#f1f5f9', height: 8, borderRadius: '4px' }}
                    />
                    {montoTotal > cupoDisponible && (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '11px', fontWeight: 700, background: '#fef2f2', padding: '8px', borderRadius: '6px' }}>
                            <MainIcon.CloseCircleOutlined /> ¡Atención! Supera el cupo disponible de {Main.formatCurrency(cupoDisponible)}
                        </div>
                    )}
                    {montoTotal <= cupoDisponible && montoTotal >= cupoDisponible * 0.9 && montoTotal > 0 && (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '11px', fontWeight: 600 }}>
                            <MainIcon.InfoCircleOutlined /> Cerca del límite de cupo disponible
                        </div>
                    )}

                    {/* Utilization Progress Bar */}
                    <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Utilización de Cupo</span>
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                                {((montoTotal / limiteEmpresa) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <Main.Progress
                            percent={(montoTotal / limiteEmpresa) * 100}
                            showInfo={false}
                            strokeColor={{
                                '0%': '#10b981',
                                '100%': '#059669',
                            }}
                            trailColor="#f1f5f9"
                            strokeWidth={6}
                        />
                    </div>
                </div>

                {/* Suggested Assignment Result */}
                <div style={{
                    padding: '24px',
                    background: 'linear-gradient(235deg, #5c6f8b, #002140)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '-20px',
                        opacity: 0.1,
                        transform: 'rotate(-15deg)'
                    }}>
                        <MainIcon.BankOutlined style={{ fontSize: '100px', color: '#ffffff' }} />
                    </div>

                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                        Asignación Sugerida por Persona
                    </span>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                        <span style={{ color: '#38bdf8', fontSize: '24px' }}>₲</span>
                        {Main.formatCurrency(asignacionPorPersona).replace('₲', '').trim()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 500, background: 'rgba(56, 189, 248, 0.1)', padding: '4px 12px', borderRadius: '100px' }}>
                        Basado en {personas} colaboradores
                    </div>
                </div>

            </div>
        </Main.Card>
    );
};

export default SimuladorBeneficios;
