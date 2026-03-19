import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import MainUrl from '../../url/mainUrl';

const SolicitudModalView = ({
    visible,
    form: formProp,
    mode,
    solicitud,
    onClose,
    onSubmit,
    onSend,
    onReject,
    loading
}) => {
    const { nombre, empresa, usuario } = Main.useAuth();
    const [formInternal] = Main.Form.useForm();
    const form = formProp || formInternal;
    const message = Main.useMessage();
    const [detalles, setDetalles] = React.useState([]);
    const [beneficiarios, setBeneficiarios] = React.useState([]);
    const [loadingBenef, setLoadingBenef] = React.useState(false);
    const [selectedBeneficiario, setSelectedBeneficiario] = React.useState(null);
    const [montoIndividual, setMontoIndividual] = React.useState(0);
    const [montoMasivo, setMontoMasivo] = React.useState(0);
    const [empresas, setEmpresas] = React.useState([]);
    const [loadingEmp, setLoadingEmp] = React.useState(false);
    const [empresaActualData, setEmpresaActualData] = React.useState(null);
    const amountInputRef = React.useRef(null);
    const benefSelectRef = React.useRef(null);

    // Cargar beneficiarios para el select
    const fetchBeneficiarios = async () => {
        setLoadingBenef(true);
        try {
            // Usamos el endpoint base optimizado para el contexto de empresa
            const resp = await Main.Request('/base/beneficiario/listar', 'GET');
            if (resp.data.success) {
                // Solo beneficiarios ACTIVOS pueden recibir carga
                setBeneficiarios(resp.data.data.filter(b => b.estado === 'A'));
            }
        } catch (error) {
            console.error("Error fetching benefs:", error);
        } finally {
            setLoadingBenef(false);
        }
    };

    const fetchEmpresaActual = async () => {
        try {
            const resp = await Main.Request('/base/empresa/status', 'GET');
            if (resp.data.success) {
                setEmpresaActualData(resp.data.data);
            }
        } catch (error) {
            console.error("Error fetching company status:", error);
        }
    };

    const fetchEmpresas = async () => {
        setLoadingEmp(true);
        try {
            const resp = await Main.Request('/base/empresa/listar_proveedores', 'GET');
            if (resp.data.success) {
                // Solo empresas marcadas como PROVEEDORAS pueden ser destino de créditos
                setEmpresas(resp.data.data);
            }
        } catch (error) {
            console.error("Error fetching empresas:", error);
        } finally {
            setLoadingEmp(false);
        }
    };

    React.useEffect(() => {
        if (visible) {
            fetchEmpresaActual(); // Siempre obtener datos frescos al abrir
            if (mode === 'create') {
                form.resetFields();
                setDetalles([]);
                fetchBeneficiarios();
                fetchEmpresas();
            } else if (solicitud) {
                // Primero limpiar errores previos antes de cargar nuevos valores
                form.resetFields();
                if (mode !== 'view') {
                    form.setFieldsValue(solicitud);
                }
                fetchDetalles(solicitud.cod_solicitud);
                if (mode === 'edit') {
                    fetchBeneficiarios();
                    fetchEmpresas();
                }
            }
        } else {
            // Al cerrar, limpiar todo para evitar residuos visuales
            form.resetFields();
        }
    }, [visible, mode, solicitud]);

    const fetchDetalles = async (cod) => {
        if (!cod) return;
        try {
            const resp = await Main.Request(`${MainUrl.url_detalles}/${cod}`, 'GET');
            if (resp.data.success) {
                setDetalles(resp.data.data.map(d => ({ ...d, key: d.cod_beneficiario })));
            }
        } catch (error) {
            console.error("Error fetching detalles:", error);
        }
    };

    const isEditable = mode === 'create' || (mode === 'edit' && solicitud?.estado === 'B');

    const handleAddDetalle = () => {
        if (!selectedBeneficiario) return message.warning('Seleccione un beneficiario');
        if (montoIndividual <= 0) return message.warning('Ingrese un monto válido');

        const existe = detalles.find(d => d.cod_beneficiario === selectedBeneficiario.cod_beneficiario);
        if (existe) return message.warning('El beneficiario ya está en la lista');

        // Validar monto_limite
        const limite = parseFloat(selectedBeneficiario.monto_limite) || 0;
        if (limite > 0 && montoIndividual > limite) {
            return message.error(`El monto (${Main.formatCurrency(montoIndividual)}) excede el límite del beneficiario (${Main.formatCurrency(limite)})`);
        }

        const nuevoDetalle = {
            key: selectedBeneficiario.cod_beneficiario,
            cod_beneficiario: selectedBeneficiario.cod_beneficiario,
            nombre: selectedBeneficiario.nombre_completo,
            nro_documento: selectedBeneficiario.nro_documento,
            monto_limite: limite,
            monto: montoIndividual
        };

        setDetalles([...detalles, nuevoDetalle]);
        setSelectedBeneficiario(null);
        setMontoIndividual(0);
        // Volver el foco al buscador para la siguiente carga
        setTimeout(() => benefSelectRef.current?.focus(), 100);
    };

    const handleFinalSubmit = async (enviarDirecto = false) => {
        try {
            const values = await form.validateFields();
            if (detalles.length === 0) return message.warning('Debe agregar al menos un beneficiario');

            // Validar que todos tengan monto > 0
            const sinMonto = detalles.filter(d => !d.monto || d.monto <= 0);
            if (sinMonto.length > 0) {
                return message.warning(`Hay ${sinMonto.length} beneficiario(s) sin monto asignado. Complete todos los montos.`);
            }

            // Validar que ninguno exceda su monto_limite
            const excedidos = detalles.filter(d => {
                const lim = d.monto_limite || 0;
                return lim > 0 && d.monto > lim;
            });
            if (excedidos.length > 0) {
                return message.error(`Hay ${excedidos.length} beneficiario(s) con monto excedido. Corrija antes de guardar.`);
            }

            const payload = {
                ...values,
                estado: enviarDirecto ? 'P' : 'B',
                detalles: detalles.map(d => ({ cod_beneficiario: d.cod_beneficiario, monto: d.monto }))
            };

            onSubmit(payload);
        } catch (error) {
            // Validaciones de form fallan
            if (error.errorFields) {
                message.warning('Por favor, complete los campos obligatorios');
            }
        }
    };

    // ─── Seleccionar TODOS los beneficiarios activos ────────────────
    const handleSelectAll = () => {
        if (beneficiarios.length === 0) return message.warning('No hay beneficiarios activos disponibles');

        const nuevosDetalles = beneficiarios
            .filter(b => !detalles.find(d => d.cod_beneficiario === b.cod_beneficiario))
            .map(b => ({
                key: b.cod_beneficiario,
                cod_beneficiario: b.cod_beneficiario,
                nombre: b.nombre_completo,
                nro_documento: b.nro_documento,
                monto_limite: parseFloat(b.monto_limite) || 0,
                monto: 0
            }));

        if (nuevosDetalles.length === 0) return message.info('Todos los beneficiarios ya están en la lista');

        setDetalles(prev => [...prev, ...nuevosDetalles]);
        message.success(`Se agregaron ${nuevosDetalles.length} beneficiarios a la lista`);
    };

    // ─── Quitar todos de la lista ──────────────────────────────────
    const handleRemoveAll = () => {
        if (detalles.length === 0) return;
        setDetalles([]);
        message.info('Se quitaron todos los beneficiarios de la lista');
    };

    // ─── Aplicar monto uniforme a todos ────────────────────────────
    const handleApplyMontoToAll = () => {
        if (montoMasivo <= 0) return message.warning('Ingrese un monto válido para aplicar');
        if (detalles.length === 0) return message.warning('No hay beneficiarios en la lista');

        const errores = [];
        const actualizados = detalles.map(d => {
            const limite = parseFloat(d.monto_limite) || 0;
            if (limite > 0 && montoMasivo > limite) {
                errores.push(`${d.nombre}: Límite ${Main.formatCurrency(limite)}`);
                return { ...d, monto: limite }; // Asignar el máximo permitido
            }
            return { ...d, monto: montoMasivo };
        });

        setDetalles(actualizados);

        if (errores.length > 0) {
            Main.Modal.info({
                title: 'Ajuste por límites individuales',
                content: (
                    <div style={{ maxHeight: 200, overflow: 'auto' }}>
                        <p style={{ marginBottom: 8, color: '#475569' }}>Los siguientes beneficiarios tienen un límite menor al monto ingresado. Se les asignó su monto máximo:</p>
                        {errores.map((err, i) => <div key={i} style={{ fontSize: 11, color: '#f59e0b' }}>⚠ {err}</div>)}
                    </div>
                )
            });
        } else {
            message.success(`Monto de ${Main.formatCurrency(montoMasivo)} aplicado a ${detalles.length} beneficiarios`);
        }
        setMontoMasivo(0);
    };

    // ─── Editar monto inline en la tabla ───────────────────────────
    const handleEditMonto = (cod_beneficiario, nuevoMonto) => {
        const detalle = detalles.find(d => d.cod_beneficiario === cod_beneficiario);
        if (!detalle) return;

        // No bloqueamos aquí para que pueda "pintar en rojo" como pidió el usuario
        // La validación se hace al guardar
        setDetalles(prev => prev.map(d =>
            d.cod_beneficiario === cod_beneficiario ? { ...d, monto: nuevoMonto } : d
        ));
    };

    const handleRemoveDetalle = (cod) => {
        setDetalles(detalles.filter(d => d.cod_beneficiario !== cod));
    };

    const totalMonto = detalles.reduce((sum, d) => sum + (Number(d.monto) || 0), 0);
    const limiteCreditoEmpresa = parseFloat(solicitud?.limite_credito || empresaActualData?.limite_credito || empresa?.limite_credito || 0);
    const cupoBaseBackend = parseFloat(solicitud?.cupo_asignado || empresaActualData?.cupo_asignado || 0);
    const isConfirmada = solicitud?.estado === 'C';
    const isRejected = solicitud?.estado === 'R';
    const cupoProyectadoTotal = isConfirmada ? cupoBaseBackend : (cupoBaseBackend + totalMonto);
    const isIlimitadoEmpresa = limiteCreditoEmpresa === 0;
    const excederiaCupo = !isIlimitadoEmpresa && cupoProyectadoTotal > limiteCreditoEmpresa;
    const porcentajeCupo = isIlimitadoEmpresa ? 0 : Math.min(100, Math.round((cupoProyectadoTotal / (limiteCreditoEmpresa || 1)) * 100));

    const getEstadoConfig = (estado) => {
        return Main.estadosSolicitud[estado] || {
            color: 'default',
            text: estado,
            icon: 'QuestionCircleOutlined'
        };
    };

    const modalConfig = {
        create: {
            title: 'Nueva Solicitud',
            subtitle: 'Complete la información de la solicitud',
            icon: <MainIcon.FileAddOutlined />,
            okText: 'Guardar Borrador',
        },
        edit: {
            title: 'Editar Solicitud',
            subtitle: 'Modifique los datos necesarios',
            icon: <MainIcon.EditOutlined />,
            okText: 'Guardar Cambios',
        },
        view: {
            title: 'Detalle de Solicitud',
            subtitle: 'Información completa y auditoría',
            icon: <MainIcon.FileTextOutlined />,
            okText: null,
        },
    };

    const config = modalConfig[mode] || modalConfig.view;
    const estadoConfig = solicitud ? getEstadoConfig(solicitud.estado) : null;
    const Icon = estadoConfig ? MainIcon[estadoConfig.icon] : null;

    return (
        <Main.Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            closable={false}
            width={1000}
            className="solicitud-modal"
            centered
            maskClosable={false}
        >
            {/* HEADER */}
            <div className="solicitud-modal-header" style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
            }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '24px', color: '#1890ff' }}>
                        {config.icon}
                    </div>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                            {config.title}
                        </div>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                            {config.subtitle}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {solicitud && Icon && (
                        <Main.Tag icon={<Icon />} color={estadoConfig.color} style={{ fontSize: '13px', padding: '4px 12px' }}>
                            {estadoConfig.text}
                        </Main.Tag>
                    )}
                    <Main.Button
                        type="text"
                        icon={<MainIcon.CloseOutlined />}
                        onClick={onClose}
                        style={{ fontSize: '16px' }}
                    />
                </div>
            </div>

            {/* BODY */}
            <div className="solicitud-modal-body" style={{ padding: '0px', maxHeight: '72vh', overflowY: 'auto' }}>

                {/* SECCIÓN 1 — Identificación y Configuración Heredada */}
                <div style={{
                    background: '#f8fafc',
                    padding: '20px 24px',
                    borderBottom: '1px solid #e2e8f0',
                    marginBottom: '0px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Main.Tag color="blue" style={{ borderRadius: '4px', fontWeight: 600 }}>
                                <MainIcon.LockOutlined /> CONFIGURACIÓN HEREDADA
                            </Main.Tag>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Estos datos vienen de tu configuración de empresa y no son editables.</span>
                        </div>
                        {solicitud?.nro_solicitud && (
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                                SOLICITUD N° {solicitud.nro_solicitud}
                            </div>
                        )}
                    </div>

                    <Main.Row gutter={[24, 16]}>
                        <Main.Col span={6}>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Empresa</div>
                            <div style={{ fontWeight: 600, color: '#334155' }}>{solicitud?.nombre_empresa || empresa?.empresa || '-'}</div>
                        </Main.Col>
                        <Main.Col span={6}>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>RUC / RUT</div>
                            <div style={{ fontWeight: 600, color: '#334155' }}>{solicitud?.ruc_empresa || empresa?.ruc || '-'}</div>
                        </Main.Col>
                        <Main.Col span={6}>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Tipo de Empresa</div>
                            <Main.Tag color={(solicitud?.tip_empresa || empresa?.tip_empresa) === 'NOMINA' ? 'purple' : 'cyan'} style={{ fontWeight: 600 }}>
                                {solicitud?.tip_empresa || empresa?.tip_empresa || '-'}
                            </Main.Tag>
                        </Main.Col>
                        <Main.Col span={6}>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Modalidad</div>
                            <Main.Tag color="orange" style={{ fontWeight: 600 }}>
                                {solicitud?.modalidad || empresa?.modalidad || '-'}
                            </Main.Tag>
                        </Main.Col>

                        <Main.Col span={6}>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Solicitante</div>
                            <div style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Main.Avatar size="small" style={{ backgroundColor: '#1890ff' }}>{Main.generateAbbreviation(solicitud?.solicitante_nombre || nombre, 1)}</Main.Avatar>
                                {solicitud?.solicitante_nombre || nombre}
                                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 400, marginLeft: '4px' }}>
                                    ({solicitud?.solicitante_username || usuario})
                                </span>
                            </div>
                        </Main.Col>
                        <Main.Col span={6}>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Fecha Solicitud</div>
                            <div style={{ fontWeight: 600, color: '#334155' }}>
                                {solicitud?.fecha_creacion ? Main.formatDate(solicitud.fecha_creacion) : Main.formatDate(new Date())}
                            </div>
                        </Main.Col>

                        {/* Indicador de Cupo */}
                        <Main.Col span={24}>
                            <div style={{ marginTop: '8px', padding: '12px', background: '#fff', borderRadius: '8px', border: `1px solid ${excederiaCupo ? '#ef4444' : '#e2e8f0'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                                        <MainIcon.DashboardOutlined style={{ marginRight: '6px' }} />
                                        Uso de Cupo de Empresa {!isConfirmada && <span style={{ color: '#1890ff', fontSize: '10px' }}>(Proyectado)</span>}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                                        Disponible: <b style={{ color: porcentajeCupo > 90 ? '#ef4444' : '#10b981' }}>
                                            {isIlimitadoEmpresa ? 'Ilimitado' : Main.formatCurrency(limiteCreditoEmpresa - cupoProyectadoTotal)}
                                        </b>
                                    </span>
                                </div>
                                <Main.Progress
                                    percent={porcentajeCupo}
                                    strokeColor={isIlimitadoEmpresa ? '#94a3b8' : { '0%': '#10b981', '70%': '#f59e0b', '100%': '#ef4444' }}
                                    status={isIlimitadoEmpresa ? 'normal' : (porcentajeCupo > 95 ? 'exception' : 'active')}
                                    size="small"
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#94a3b8' }}>
                                    <span>Consumo Total: {Main.formatCurrency(cupoProyectadoTotal)}</span>
                                    <span>Límite de Crédito: {isIlimitadoEmpresa ? 'Ilimitado' : Main.formatCurrency(limiteCreditoEmpresa)}</span>
                                </div>
                                {!isConfirmada && !isRejected && totalMonto > 0 && (
                                    <div style={{ fontSize: '10px', color: excederiaCupo ? '#ef4444' : '#1890ff', marginTop: '4px', textAlign: 'right', fontWeight: excederiaCupo ? 700 : 400 }}>
                                        {excederiaCupo ? '⚠ EXCEDE LÍMITE DE CRÉDITO' : `+ ${Main.formatCurrency(totalMonto)} de esta solicitud`}
                                    </div>
                                )}
                            </div>
                        </Main.Col>
                    </Main.Row>
                </div>

                <div style={{ padding: '24px' }}>

                    {mode === 'view' ? (
                        <>
                            {/* SECCIÓN: INFORMACIÓN GENERAL (VISTA) */}
                            <div className="form-section" style={{ marginBottom: '24px' }}>
                                <div style={{
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    marginBottom: '16px',
                                    paddingBottom: '8px',
                                    borderBottom: '2px solid #1890ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <MainIcon.InfoCircleOutlined style={{ color: '#1890ff' }} />
                                    Información General
                                </div>

                                <Main.Descriptions bordered column={1} size="small">
                                    <Main.Descriptions.Item label="Empresa Destino / Otorgante">
                                        <b style={{ color: '#1e40af' }}>{solicitud?.nombre_empresa_destino || 'No especificada'}</b>
                                    </Main.Descriptions.Item>
                                    <Main.Descriptions.Item label="Descripción">
                                        {solicitud?.descripcion || '-'}
                                    </Main.Descriptions.Item>
                                    <Main.Descriptions.Item label="Observaciones">
                                        {solicitud?.observaciones || '-'}
                                    </Main.Descriptions.Item>
                                </Main.Descriptions>

                                <div style={{ marginTop: '24px' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '12px', color: '#334155' }}>Lista de Empleados Habilitados</div>
                                    <Main.Table
                                        size="small"
                                        dataSource={detalles}
                                        pagination={{ pageSize: 5 }}
                                        columns={[
                                            { title: 'Beneficiario', dataIndex: 'nombre' },
                                            { title: 'Documento', dataIndex: 'nro_documento', width: 120 },
                                            {
                                                title: 'Monto',
                                                dataIndex: 'monto',
                                                align: 'right',
                                                render: m => <b style={{ color: '#059669' }}>{Main.formatCurrency(m)}</b>
                                            }
                                        ]}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <Main.Form form={form} layout="vertical" scrollToFirstError={true}>
                            {excederiaCupo && (
                                <Main.Alert
                                    message="Límite de Crédito Excedido"
                                    description={`El monto total proyectado de esta solicitud (${Main.formatCurrency(cupoProyectadoTotal)}) excede el límite de crédito de la empresa (${Main.formatCurrency(limiteCreditoEmpresa)}). No podrá guardar ni enviar la solicitud hasta corregirlo.`}
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: '24px' }}
                                />
                            )}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ background: '#3b82f6', width: '24px', height: '24px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</div>
                                    Datos de la Solicitud y Destino
                                </div>
                                <Main.Row gutter={16}>
                                    {/* {isEditable && empresas.length > 1 && (
                                        <Main.Col span={24}>
                                            <Main.Form.Item
                                                name="cod_empresa_destino"
                                                label={<span style={{ fontWeight: 600, color: '#475569' }}>Empresa Otorgante</span>}
                                                tooltip="Seleccione la entidad que adjudicará el crédito. Si su empresa ya tiene un proveedor asignado, puede dejar este campo vacío y se asignará automáticamente."
                                            >
                                                <Main.Select
                                                    disabled={!isEditable}
                                                    placeholder="Seleccione proveedor (Opcional si tiene uno predeterminado)"
                                                    showSearch
                                                    allowClear
                                                    optionFilterProp="children"
                                                    suffixIcon={<MainIcon.BankOutlined />}
                                                >
                                                    {empresas.map(emp => (
                                                        <Main.Select.Option key={emp.cod_empresa} value={emp.cod_empresa}>
                                                            {emp.nombre}
                                                        </Main.Select.Option>
                                                    ))}
                                                </Main.Select>
                                            </Main.Form.Item>
                                        </Main.Col>
                                    )} */}
                                    <Main.Col span={24}>
                                        <Main.Form.Item
                                            name="descripcion"
                                            label={<span style={{ fontWeight: 500, color: '#64748b' }}>Descripción / Motivo de Carga</span>}
                                            rules={isEditable ? [{ required: true, message: 'La descripción es obligatoria' }] : []}
                                        >
                                            <Main.Input
                                                disabled={!isEditable}
                                                placeholder="Ej: Vales para personal, Beneficio otorgado mes Enero etc..."
                                                prefix={<MainIcon.FileTextOutlined style={{ color: '#94a3b8' }} />}
                                            />
                                        </Main.Form.Item>
                                    </Main.Col>
                                </Main.Row>
                                <Main.Row gutter={16}>
                                    <Main.Col span={24}>
                                        <Main.Form.Item
                                            name="observaciones"
                                            label={<span style={{ fontWeight: 500, color: '#64748b' }}>Observaciones Internas</span>}
                                        >
                                            <Main.Input
                                                disabled={!isEditable}
                                                placeholder="Cualquier aclaración técnica..."
                                                prefix={<MainIcon.MessageOutlined style={{ color: '#94a3b8' }} />}
                                            />
                                        </Main.Form.Item>
                                    </Main.Col>
                                </Main.Row>
                            </div>

                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ background: '#3b82f6', width: '24px', height: '24px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</div>
                                Carga de Beneficiarios y Montos
                            </div>

                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                                {/* Sección de acciones masivas */}
                                <div style={{ fontWeight: 600, marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <span style={{ fontSize: '13px', color: '#475569' }}>Agregar Beneficiarios</span>
                                    <Main.Space wrap>
                                        <Main.Button
                                            type="primary"
                                            size="small"
                                            disabled={!isEditable}
                                            icon={<MainIcon.UsergroupAddOutlined />}
                                            onClick={handleSelectAll}
                                            style={{ background: '#6366f1', borderColor: '#6366f1' }}
                                        >
                                            Seleccionar Todos ({beneficiarios.length})
                                        </Main.Button>
                                        {detalles.length > 0 && (
                                            <Main.Button
                                                danger
                                                size="small"
                                                icon={<MainIcon.DeleteOutlined />}
                                                onClick={handleRemoveAll}
                                            >
                                                Quitar Todos
                                            </Main.Button>
                                        )}
                                    </Main.Space>
                                </div>

                                {/* Carga individual: un beneficiario a la vez */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                                        <MainIcon.UserAddOutlined style={{ marginRight: 4 }} /> Agregar Individualmente
                                    </div>
                                    <Main.Row gutter={12} align="bottom">
                                        <Main.Col span={10}>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Buscar Beneficiario</div>
                                            <Main.Select
                                                ref={benefSelectRef}
                                                showSearch
                                                allowClear
                                                disabled={!isEditable}
                                                style={{ width: '100%' }}
                                                placeholder="Nombre o Documento..."
                                                filterOption={(input, option) => {
                                                    const b = option.data;
                                                    if (!b) return false;
                                                    const searchTerm = input.toLowerCase();
                                                    return (b.nombre_completo || '').toLowerCase().includes(searchTerm) ||
                                                        (b.nro_documento || '').toLowerCase().includes(searchTerm);
                                                }}
                                                optionFilterProp="children"
                                                loading={loadingBenef}
                                                value={selectedBeneficiario?.cod_beneficiario}
                                                onDropdownVisibleChange={(open) => {
                                                    if (open) fetchBeneficiarios();
                                                }}
                                                onChange={(val, opt) => {
                                                    const b = beneficiarios.find(x => x.cod_beneficiario === val);
                                                    setSelectedBeneficiario(b);
                                                    if (val) {
                                                        setTimeout(() => {
                                                            amountInputRef.current?.focus();
                                                            amountInputRef.current?.select();
                                                        }, 100);
                                                    }
                                                }}
                                                suffixIcon={<MainIcon.SearchOutlined />}
                                            >
                                                {beneficiarios
                                                    .filter(b => !detalles.some(d => d.cod_beneficiario === b.cod_beneficiario))
                                                    .map(b => {
                                                        const limB = parseFloat(b.monto_limite) || 0;
                                                        return (
                                                            <Main.Select.Option key={b.cod_beneficiario} value={b.cod_beneficiario} data={b}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <span style={{ fontWeight: 500 }}>{b.nombre_completo}</span>
                                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>{b.nro_documento}</span>
                                                                        {limB > 0 && (
                                                                            <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 600 }}>Lím: {Main.formatCurrency(limB)}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Main.Select.Option>
                                                        );
                                                    })}
                                            </Main.Select>
                                        </Main.Col>
                                        <Main.Col span={8}>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                                                Monto a Cargar
                                                {selectedBeneficiario && parseFloat(selectedBeneficiario.monto_limite) > 0 && (
                                                    <span style={{ color: '#f59e0b', marginLeft: 4 }}>(Máx: {Main.formatCurrency(parseFloat(selectedBeneficiario.monto_limite))})</span>
                                                )}
                                            </div>
                                            <Main.InputNumber
                                                ref={amountInputRef}
                                                style={{ width: '100%' }}
                                                placeholder="0"
                                                min={0}
                                                precision={0}
                                                max={999999999999}
                                                formatter={value => value ? `₲ ${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : ''}
                                                parser={value => value.replace(/₲\s?|(\.*)/g, '')}
                                                value={montoIndividual}
                                                onChange={setMontoIndividual}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddDetalle();
                                                    }
                                                }}
                                                prefix={<MainIcon.DollarOutlined style={{ color: '#94a3b8' }} />}
                                                status={selectedBeneficiario && montoIndividual > (parseFloat(selectedBeneficiario.monto_limite) || 0) && parseFloat(selectedBeneficiario.monto_limite) > 0 ? "error" : ""}
                                                disabled={!isEditable}
                                            />
                                        </Main.Col>
                                        <Main.Col span={6}>
                                            <Main.Button
                                                type="primary"
                                                block
                                                disabled={!isEditable}
                                                onClick={handleAddDetalle}
                                                icon={<MainIcon.PlusOutlined />}
                                                style={{ background: '#1e293b', borderColor: '#1e293b' }}
                                            >
                                                Agregar
                                            </Main.Button>
                                        </Main.Col>
                                    </Main.Row>
                                </div>

                                {/* Aplicar monto uniforme a todos */}
                                {detalles.length > 0 && (
                                    <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                                            <MainIcon.BulbOutlined style={{ marginRight: 4, color: '#f59e0b' }} /> Aplicar Monto Uniforme a Todos
                                        </div>
                                        <Main.Row gutter={12} align="bottom">
                                            <Main.Col span={14}>
                                                <Main.InputNumber
                                                    style={{ width: '100%' }}
                                                    placeholder="Monto a aplicar a todos los beneficiarios"
                                                    min={0}
                                                    precision={0}
                                                    formatter={value => value ? `₲ ${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : ''}
                                                    parser={value => value.replace(/₲\s?|(\.*)/g, '')}
                                                    value={montoMasivo}
                                                    onChange={setMontoMasivo}
                                                    prefix={<MainIcon.DollarOutlined style={{ color: '#f59e0b' }} />}
                                                    disabled={!isEditable}
                                                />
                                            </Main.Col>
                                            <Main.Col span={10}>
                                                <Main.Button
                                                    disabled={!isEditable}
                                                    type="primary"
                                                    size="small"
                                                    onClick={handleApplyMontoToAll}
                                                    icon={<MainIcon.BulbOutlined />}
                                                    style={{ background: '#f59e0b', borderColor: '#f59e0b', color: '#fff' }}
                                                >
                                                    Aplicar a {detalles.length} beneficiarios
                                                </Main.Button>
                                            </Main.Col>
                                        </Main.Row>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px' }}>
                                            * Si algún beneficiario tiene un límite menor, se le asignará su monto máximo permitido.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TABLA DE DETALLES Y RESUMEN */}
                            <div style={{ marginBottom: '32px' }}>
                                <Main.Row gutter={24}>
                                    <Main.Col span={16}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 600, color: '#334155' }}>Lista de Habilitación</span>
                                            <Main.Tag color="blue" style={{ borderRadius: "12px" }}>{detalles.length} empleados en lista</Main.Tag>
                                        </div>
                                        <Main.Table
                                            size="small"
                                            className="premium-table"
                                            columns={[
                                                {
                                                    title: 'Empleado',
                                                    key: 'empleado',
                                                    render: (_, record) => (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <Main.Avatar size="small" style={{ backgroundColor: '#f0f2f5', color: '#1890ff', fontSize: '10px' }}>
                                                                {Main.generateAbbreviation(record.nombre, 1)}
                                                            </Main.Avatar>
                                                            <div>
                                                                <div style={{ fontSize: '12px', fontWeight: 500 }}>{record.nombre}</div>
                                                                <div style={{ fontSize: '10px', color: '#94a3b8' }}>{record.nro_documento}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                },
                                                {
                                                    title: 'Límite',
                                                    key: 'monto_limite',
                                                    align: 'right',
                                                    width: 110,
                                                    render: (_, record) => {
                                                        const lim = record.monto_limite || 0;
                                                        return lim > 0
                                                            ? <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 500 }}>{Main.formatCurrency(lim)}</span>
                                                            : <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Sin límite</span>;
                                                    }
                                                },
                                                {
                                                    title: 'Monto a Cargar',
                                                    key: 'monto',
                                                    align: 'right',
                                                    width: 160,
                                                    render: (_, record) => {
                                                        const lim = parseFloat(record.monto_limite) || 0;
                                                        const montoAct = parseFloat(record.monto) || 0;
                                                        const excedido = lim > 0 && montoAct > lim;
                                                        return (
                                                            <div>
                                                                <Main.InputNumber
                                                                    disabled={!isEditable}
                                                                    style={{ width: '100%' }}
                                                                    min={0}
                                                                    precision={0}
                                                                    max={999999999999}
                                                                    formatter={value => value ? `₲ ${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : ''}
                                                                    parser={value => value.replace(/₲\s?|(\.*)/g, '')}
                                                                    value={record.monto}
                                                                    onChange={(val) => handleEditMonto(record.cod_beneficiario, val || 0)}
                                                                    prefix={<MainIcon.DollarOutlined style={{ color: '#94a3b8' }} />}
                                                                    status={isEditable && excedido ? 'error' : ''}
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                },
                                                {
                                                    title: '',
                                                    key: 'action',
                                                    width: 50,
                                                    align: 'center',
                                                    render: (_, record) => (
                                                        <Main.Button
                                                            danger
                                                            disabled={!isEditable}
                                                            type="text"
                                                            size="small"
                                                            icon={<MainIcon.DeleteOutlined />}
                                                            onClick={() => handleRemoveDetalle(record.cod_beneficiario)}
                                                        />
                                                    )
                                                }
                                            ]}
                                            dataSource={detalles}
                                            pagination={{ pageSize: 5, size: 'small' }}
                                            scroll={{ y: 240 }}
                                        />
                                    </Main.Col>
                                    <Main.Col span={8}>
                                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '16px' }}>Resumen de Carga</div>

                                                <div style={{ marginBottom: '12px' }}>
                                                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Monto Total</div>
                                                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{Main.formatCurrency(totalMonto)}</div>
                                                </div>

                                                <div style={{ marginBottom: '12px' }}>
                                                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Cant. Beneficiarios</div>
                                                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#334155' }}>{detalles.length}</div>
                                                </div>


                                            </div>

                                            {(() => {
                                                const limiteCredito = parseFloat(solicitud?.limite_credito || empresaActualData?.limite_credito || empresa?.limite_credito || 0);
                                                const cupoAsignado = parseFloat(solicitud?.cupo_asignado || empresaActualData?.cupo_asignado || 0);
                                                const isExcedido = limiteCredito > 0 && totalMonto > (limiteCredito - cupoAsignado);

                                                return detalles.length > 0 && isExcedido && (
                                                    <Main.Alert
                                                        message="Cupo Excedido"
                                                        description={`El monto total excede el saldo disponible de la empresa (${Main.formatCurrency(limiteCredito - cupoAsignado)}).`}
                                                        type="error"
                                                        showIcon
                                                        style={{ marginTop: '8px' }}
                                                    />
                                                );
                                            })()}
                                        </div>
                                    </Main.Col>
                                </Main.Row>
                            </div>

                            {/* SECCIÓN 4 — DOCUMENTACIÓN (PARA BENEFICIARIAS) */}
                            {(solicitud?.tip_empresa || empresa?.tip_empresa) === 'BENEFICIARIA' && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ background: '#3b82f6', width: '24px', height: '24px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>4</div>
                                        Sustento de Operación
                                    </div>
                                    <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '24px', textAlign: 'center', background: '#f8fafc' }}>
                                        <MainIcon.UploadOutlined style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '8px' }} />
                                        <div style={{ color: '#475569', fontWeight: 500 }}>Subir comprobante de pago / transferencia</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>Recomendado para agilizar la habilitación en caja.</div>
                                        <Main.Upload maxCount={1}>
                                            <Main.Button icon={<MainIcon.UploadOutlined />}>Seleccionar Archivo</Main.Button>
                                        </Main.Upload>
                                    </div>
                                </div>
                            )}
                        </Main.Form>
                    )}

                    {/* SECCIÓN: AUDITORÍA COMPLETA */}
                    {solicitud && mode === 'view' && (
                        <div className="form-section" style={{ marginBottom: '24px' }}>
                            <div style={{
                                fontSize: '15px',
                                fontWeight: 600,
                                marginBottom: '16px',
                                paddingBottom: '8px',
                                borderBottom: '2px solid #722ed1',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <MainIcon.AuditOutlined style={{ color: '#722ed1' }} />
                                Historial y Auditoría
                            </div>

                            <Main.Timeline>
                                {/* Creación */}
                                <Main.Timeline.Item
                                    dot={<MainIcon.FileAddOutlined style={{ fontSize: '16px' }} />}
                                    color="blue"
                                >
                                    <div style={{ marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                                            <MainIcon.UserOutlined style={{ marginRight: '8px' }} />
                                            Creado por: {solicitud.solicitante_nombre || solicitud.usuario_creacion || 'Sistema'}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                                            <MainIcon.ClockCircleOutlined style={{ marginRight: '8px' }} />
                                            {Main.formatDate(solicitud.fecha_creacion)}
                                        </div>
                                    </div>
                                </Main.Timeline.Item>

                                {/* Modificación */}
                                {solicitud.usuario_modificacion && (
                                    <Main.Timeline.Item
                                        dot={<MainIcon.EditOutlined style={{ fontSize: '16px' }} />}
                                        color="orange"
                                    >
                                        <div style={{ marginBottom: '8px' }}>
                                            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                                                <MainIcon.UserOutlined style={{ marginRight: '8px' }} />
                                                Modificado por: {solicitud.usuario_modificacion_nombre || solicitud.usuario_modificacion}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                                                <MainIcon.ClockCircleOutlined style={{ marginRight: '8px' }} />
                                                {Main.formatDate(solicitud.fecha_modificacion)}
                                            </div>
                                        </div>
                                    </Main.Timeline.Item>
                                )}

                                {/* Confirmación */}
                                {solicitud.usuario_confirmacion && (
                                    <Main.Timeline.Item
                                        dot={
                                            solicitud.estado === 'ANULADA'
                                                ? <MainIcon.StopOutlined style={{ fontSize: '16px' }} />
                                                : solicitud.estado === 'RECHAZADA'
                                                    ? <MainIcon.CloseCircleOutlined style={{ fontSize: '16px' }} />
                                                    : <MainIcon.CheckCircleOutlined style={{ fontSize: '16px' }} />
                                        }
                                        color={
                                            solicitud.estado === 'ANULADA' ? 'gray' :
                                                solicitud.estado === 'RECHAZADA' ? 'red' : 'green'
                                        }
                                    >
                                        <div style={{ marginBottom: '8px' }}>
                                            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                                                <MainIcon.UserOutlined style={{ marginRight: '8px' }} />
                                                {solicitud.estado === 'ANULADA' ? 'Anulado por' :
                                                    solicitud.estado === 'RECHAZADA' ? 'Rechazado por' : 'Confirmado por'
                                                }: {solicitud.usuario_confirmacion_nombre || solicitud.usuario_confirmacion}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                                                <MainIcon.ClockCircleOutlined style={{ marginRight: '8px' }} />
                                                {Main.formatDate(solicitud.fecha_confirmacion)}
                                            </div>
                                            {solicitud.motivo_rechazo && (
                                                <Main.Alert
                                                    type="error"
                                                    message="Motivo de rechazo"
                                                    description={solicitud.motivo_rechazo}
                                                    style={{ marginTop: '12px' }}
                                                    showIcon
                                                />
                                            )}
                                        </div>
                                    </Main.Timeline.Item>
                                )}
                            </Main.Timeline>
                        </div>
                    )}

                    {/* MENSAJE SI NO HAY CONFIRMACIÓN */}
                    {solicitud && mode === 'view' && !solicitud.usuario_confirmacion && solicitud.estado === 'BORRADOR' && (
                        <Main.Alert
                            type="info"
                            message="Solicitud en borrador"
                            description="Esta solicitud aún no ha sido enviada para aprobación."
                            showIcon
                            icon={<MainIcon.InfoCircleOutlined />}
                            style={{ marginTop: '16px' }}
                        />
                    )}

                    {solicitud && mode === 'view' && !solicitud.usuario_confirmacion && solicitud.estado === 'PENDIENTE' && (
                        <Main.Alert
                            type="warning"
                            message={(solicitud.tip_empresa || empresa?.tip_empresa) === 'NOMINA' ? "Solicitud en bandeja de supervisor" : "Solicitud pendiente de pago"}
                            description={(solicitud.tip_empresa || empresa?.tip_empresa) === 'NOMINA'
                                ? "Esta solicitud está aguardando la aprobación de un supervisor para habilitar el crédito."
                                : "Esta solicitud está aguardando la confirmación de pago para habilitar el saldo en caja."
                            }
                            showIcon
                            icon={<MainIcon.ClockCircleOutlined />}
                            style={{ marginTop: '16px' }}
                        />
                    )}
                    {solicitud && solicitud.estado === 'CONFIRMADA' && solicitud.nro_comprobante && (
                        <Main.Alert
                            type="success"
                            message="Carga Confirmada"
                            description={`Esta solicitud fue procesada exitosamente con el comprobante Nro: ${solicitud.nro_comprobante}`}
                            showIcon
                            icon={<MainIcon.FileProtectOutlined />}
                            style={{ marginTop: '16px' }}
                        />
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
            }}>
                {mode === 'view' && (
                    <Main.Button type="primary" onClick={onClose}>
                        Cerrar
                    </Main.Button>
                )}

                {mode !== 'view' && (
                    <>
                        <Main.Button onClick={onClose}>
                            Cancelar
                        </Main.Button>
                        <Main.Button
                            loading={loading}
                            icon={<MainIcon.SaveOutlined />}
                            disabled={excederiaCupo}
                            onClick={() => handleFinalSubmit(false)}
                        >
                            Guardar Borrador
                        </Main.Button>
                        <Main.Button
                            type="primary"
                            loading={loading}
                            icon={<MainIcon.SendOutlined />}
                            disabled={excederiaCupo}
                            onClick={() => handleFinalSubmit(true)}
                        >
                            Enviar a Confirmación
                        </Main.Button>
                    </>
                )}
            </div>
        </Main.Modal>
    );
};

export default SolicitudModalView;