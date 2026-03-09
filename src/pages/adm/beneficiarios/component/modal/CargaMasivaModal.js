import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import MainUrl from '../../url/mainUrl';

/* ── Configuración de estados visuales (factory) ── */
const getStatusConfig = () => ({
    ok: { color: 'success', text: 'Listo para cargar', icon: <MainIcon.CheckCircleOutlined /> },
    warn: { color: 'warning', text: 'Advertencia (se cargará)', icon: <MainIcon.ExclamationCircleOutlined /> },
    error: { color: 'error', text: 'No se cargará', icon: <MainIcon.CloseCircleOutlined /> },
});

const ALERTA_TEXTO = {
    existente_inactivo: 'Está inactivo en esta empresa — se reactivará y sus datos serán actualizados.',
    activo_otra_empresa: 'Ya está ACTIVO en otra empresa. No puede estar activo en dos empresas. Se registrará como Inactivo aquí.',
    duplicado_empresa: 'Ya existe y está activo en esta empresa. No se cargará.',
    duplicado_archivo: 'Documento repetido en el archivo. Corrija y vuelva a cargar.',
};

/* ── util: leer archivo con FileReader ──────────── */
const readFileAsArrayBuffer = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
        reader.readAsArrayBuffer(file);
    });

/* ── Mapeo de encabezados Excel → campos internos ── */
const mapRow = (r) => ({
    nro_documento: r['documento'] || r['nro_documento'] || '',
    ruc: r['ruc'] || '',
    nombre_completo: r['nombre y apellido'] || r['nombre_completo'] || '',
    correo: r['email'] || r['correo'] || '',
    nro_telef: r['telefono'] || r['nro_telef'] || '',
    // Monto Limite → parsear a número; 0 si vacío/inválido
    monto_limite: (() => {
        const raw = r['monto limite'] || r['monto_limite'] || '0';
        const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
        return isNaN(n) ? 0 : n;
    })(),
});

/* ── Columnas de la tabla de preview (factory) ──── */
const buildColumns = () => {
    const STATUS_CONFIG = getStatusConfig();
    return [
        { title: '#', dataIndex: 'fila', width: 46, align: 'center' },
        {
            title: 'Documento', dataIndex: 'nro_documento', width: 110,
            render: v => <b style={{ fontFamily: 'monospace' }}>{v}</b>
        },
        { title: 'Nombre', dataIndex: 'nombre_completo', ellipsis: true },
        { title: 'Teléfono', dataIndex: 'nro_telef', width: 110 },
        {
            title: 'Monto Límite', dataIndex: 'monto_limite', width: 115, align: 'right',
            render: v => (
                <span style={{ fontWeight: 500, color: v > 0 ? '#1890ff' : '#8c8c8c' }}>
                    {v > 0 ? `Gs. ${Number(v).toLocaleString('es-PY')}` : 'Sin límite'}
                </span>
            )
        },
        {
            title: 'Estado', dataIndex: 'status', width: 175,
            render: (status, record) => {
                const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.error;
                const tip = record.tipo_alerta
                    ? ALERTA_TEXTO[record.tipo_alerta]
                    : (record.errores || []).join(' | ');
                return (
                    <Main.Tooltip title={tip}>
                        <Main.Tag color={cfg.color} icon={cfg.icon}
                            style={{ cursor: 'help', whiteSpace: 'normal', lineHeight: 1.4 }}>
                            {cfg.text}
                        </Main.Tag>
                    </Main.Tooltip>
                );
            }
        },
        {
            title: 'Detalle', ellipsis: true,
            render: (_, r) => {
                if (r.tipo_alerta === 'existente_inactivo')
                    return <span style={{ color: '#d48806', fontSize: 12 }}>
                        <MainIcon.ReloadOutlined /> Inactivo — se <b>reactivará</b> con datos actualizados
                    </span>;
                if (r.tipo_alerta === 'activo_otra_empresa')
                    return <span style={{ color: '#d48806', fontSize: 12 }}>
                        <MainIcon.ExclamationCircleOutlined /> Se registrará como <b>Inactivo</b> (activo en otra empresa)
                    </span>;
                if (r.errores?.length > 0)
                    return <span style={{ color: '#cf1322', fontSize: 12 }}>⚠ {r.errores.join(' • ')}</span>;
                return <span style={{ color: '#389e0d', fontSize: 12 }}>✔ Sin conflictos</span>;
            }
        },
    ];
};

/* ── Componente principal ───────────────────────── */
const CargaMasivaModal = ({ visible, onClose, onFinish }) => {
    const [step, setStep] = React.useState(1);
    const [fileList, setFileList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [previewData, setPreviewData] = React.useState(null);
    const [resultData, setResultData] = React.useState(null);
    const message = Main.useMessage();
    // Columnas construidas dentro del componente para evitar JSX undefined al cargar módulo
    const columns = React.useMemo(() => buildColumns(), []);

    const resetState = () => { setStep(1); setFileList([]); setPreviewData(null); setResultData(null); };
    const handleClose = () => { resetState(); onClose(); };

    /* ════════════════════════════════════════════════
       PASO 1 — Leer Excel y prevalidar en backend
    ════════════════════════════════════════════════ */
    const handleValidate = async () => {
        if (fileList.length === 0) { message.warning('Seleccione un archivo primero'); return; }

        const fileObj = fileList[0].originFileObj ?? fileList[0];
        setLoading(true);
        try {
            const XLSX = await import('xlsx');
            const buffer = await readFileAsArrayBuffer(fileObj);
            const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const rawJson = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });

            if (rawJson.length === 0) {
                message.warning('El archivo está vacío o no tiene datos debajo del encabezado');
                return;
            }

            // Normalizar encabezados (lowercase + trim)
            const rows = rawJson.map(r => {
                const norm = {};
                Object.keys(r).forEach(k => {
                    norm[k.toLowerCase().trim()] = String(r[k] ?? '').trim();
                });
                return norm;
            });

            // Validar columnas mínimas
            const first = rows[0];
            const tieneDoc = 'documento' in first || 'nro_documento' in first;
            const tieneNom = 'nombre y apellido' in first || 'nombre_completo' in first;

            if (!tieneDoc || !tieneNom) {
                message.error(
                    `Columnas faltantes: ${[!tieneDoc && '"Documento"', !tieneNom && '"Nombre y Apellido"'].filter(Boolean).join(', ')}. ` +
                    'Use la Plantilla para el formato correcto.'
                );
                return;
            }

            // Mapear todas las filas incluyendo monto_limite
            const beneficiarios = rows
                .map(mapRow)
                .filter(r => r.nro_documento.trim() && r.nombre_completo.trim());

            if (beneficiarios.length === 0) {
                message.warning('No se encontraron filas válidas. Documento y Nombre son requeridos.');
                return;
            }

            const resp = await Main.Request(MainUrl.url_prevalidar, 'POST', { beneficiarios });
            if (!resp?.data?.success) {
                message.error(resp?.data?.mensaje || 'Error al prevalidar');
                return;
            }

            // Adjuntar monto_limite de las filas originales a los resultados del backend
            const rowMap = {};
            beneficiarios.forEach(b => { rowMap[b.nro_documento] = b.monto_limite; });

            const rowsConMonto = (resp.data.data || []).map(r => ({
                ...r,
                monto_limite: rowMap[r.nro_documento] ?? 0,
            }));

            setPreviewData({ rows: rowsConMonto, totales: resp.data.totales });
            setStep(2);

        } catch (err) {
            console.error('CargaMasiva validate error:', err);
            message.error('No se pudo leer el archivo. Verifique que es un Excel (.xlsx/.xls) válido.');
        } finally {
            setLoading(false);
        }
    };

    /* ════════════════════════════════════════════════
       PASO 2 — Confirmar y ejecutar la carga
    ════════════════════════════════════════════════ */
    const handleConfirm = async () => {
        const aptos = previewData?.rows.filter(r => r.status !== 'error') ?? [];
        if (aptos.length === 0) { message.warning('No hay registros válidos para cargar'); return; }

        setLoading(true);
        try {
            // Enviar todos los campos incluyendo monto_limite
            const payload = aptos.map(r => ({
                nro_documento: r.nro_documento,
                ruc: r.ruc,
                nombre_completo: r.nombre_completo,
                correo: r.correo,
                nro_telef: r.nro_telef,
                monto_limite: r.monto_limite ?? 0,
            }));

            const resp = await Main.Request(MainUrl.url_carga, 'POST', { beneficiarios: payload });

            if (resp?.data?.success) {
                setResultData(resp.data);
                setStep(3);
            } else {
                message.error(resp?.data?.mensaje || 'Error en la carga masiva');
            }
        } catch (err) {
            console.error('CargaMasiva confirm error:', err);
            message.error('Error al enviar los datos al servidor');
        } finally {
            setLoading(false);
        }
    };

    /* ── Valores derivados ─────────────────────── */
    const aptosCount = previewData?.rows.filter(r => r.status !== 'error').length ?? 0;
    const errorCount = previewData?.totales?.error ?? 0;
    const warnCount = previewData?.totales?.warn ?? 0;
    const totalCount = previewData?.totales?.total ?? 0;

    /* ── Footers por paso ──────────────────────── */
    const footer =
        step === 1 ? [
            <Main.Button key="cancel" onClick={handleClose}>Cancelar</Main.Button>,
            <Main.Button key="validate" type="primary" loading={loading}
                disabled={fileList.length === 0} onClick={handleValidate}
                icon={<MainIcon.SearchOutlined />}>
                Validar Archivo
            </Main.Button>,
        ]
            : step === 2 ? [
                <Main.Button key="back" onClick={() => { setStep(1); setPreviewData(null); }}>
                    ← Volver
                </Main.Button>,
                <Main.Button key="confirm" type="primary" loading={loading}
                    disabled={aptosCount === 0} onClick={handleConfirm}
                    icon={<MainIcon.CheckOutlined />}>
                    Confirmar Carga ({aptosCount} registro{aptosCount !== 1 ? 's' : ''})
                </Main.Button>,
            ]
                : [
                    <Main.Button key="done" type="primary"
                        onClick={() => { handleClose(); onFinish?.(); }}>
                        Finalizar y Cerrar
                    </Main.Button>,
                ];

    return (
        <Main.Modal
            title={
                <span>
                    <MainIcon.UploadOutlined style={{ marginRight: 8 }} />
                    Carga Masiva de Beneficiarios
                    <Main.Tag style={{ marginLeft: 12, verticalAlign: 'middle' }}
                        color={step === 1 ? 'blue' : step === 2 ? 'orange' : 'success'}>
                        Paso {step} de 3
                    </Main.Tag>
                </span>
            }
            open={visible}
            onCancel={handleClose}
            footer={footer}
            width={step === 1 ? 520 : 1150}
            maskClosable={false}
            centered
        >
            {/* ══════════ PASO 1: SELECCIONAR ARCHIVO ══════════ */}
            {step === 1 && (
                <div>
                    <Main.Alert type="info" showIcon style={{ marginBottom: 16 }}
                        message="Formato del archivo"
                        description={
                            <div style={{ fontSize: 12 }}>
                                <b>Obligatorias:</b> Documento, Nombre y Apellido<br />
                                <b>Opcionales:</b> RUC, Email, Telefono, Monto Limite<br />
                                <span style={{ color: '#8c8c8c' }}>
                                    Descargue la <b>Plantilla</b> desde el encabezado para el formato exacto.
                                    El campo <b>Monto Limite</b> admite el valor <b>0</b> para sin límite.
                                </span>
                            </div>
                        }
                    />

                    <Main.Upload
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
                        accept=".xlsx,.xls"
                        maxCount={1}
                        showUploadList={false}
                    >
                        <Main.Button
                            icon={<MainIcon.FileExcelOutlined />}
                            size="large"
                            style={{
                                padding: '5px 50px',
                                width: '100%', height: 90, borderStyle: 'dashed',
                                fontSize: 15,
                                color: fileList.length > 0 ? '#389e0d' : undefined,
                                borderColor: fileList.length > 0 ? '#52c41a' : undefined,
                            }}
                        >
                            {fileList.length === 0
                                ? '📂  Haga clic para seleccionar un archivo Excel (.xlsx)'
                                : `✅  ${fileList[0]?.name}`}
                        </Main.Button>
                    </Main.Upload>

                    {fileList.length > 0 && (
                        <div style={{
                            marginTop: 10, padding: '5px 50px',
                            background: '#f6ffed', border: '1px solid #b7eb8f',
                            borderRadius: 6, fontSize: 13, color: '#389e0d'
                        }}>
                            <MainIcon.CheckCircleOutlined style={{ marginRight: 6 }} />
                            Archivo listo. Haga clic en <b>Validar Archivo</b> para continuar.
                        </div>
                    )}
                </div>
            )}

            {/* ══════════ PASO 2: VISTA PREVIA ══════════════════ */}
            {step === 2 && previewData && (
                <div>
                    {/* Tarjetas de resumen */}
                    <Main.Row gutter={10} style={{ marginBottom: 12 }}>
                        {[
                            { label: 'Total filas', value: totalCount, color: '#1890ff', icon: <MainIcon.FileTextOutlined /> },
                            { label: 'Sin problemas', value: previewData.totales.ok ?? 0, color: '#52c41a', icon: <MainIcon.CheckCircleOutlined /> },
                            { label: 'Con advertencia', value: warnCount, color: '#faad14', icon: <MainIcon.ExclamationCircleOutlined /> },
                            { label: 'No se cargarán', value: errorCount, color: '#ff4d4f', icon: <MainIcon.CloseCircleOutlined /> },
                        ].map(({ label, value, color, icon }) => (
                            <Main.Col span={6} key={label}>
                                <Main.Card size="small" bodyStyle={{ padding: '10px 14px' }}
                                    style={{ borderTop: `3px solid ${color}`, borderRadius: 8 }}>
                                    <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 2 }}>{icon} {label}</div>
                                    <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
                                </Main.Card>
                            </Main.Col>
                        ))}
                    </Main.Row>

                    {warnCount > 0 && (
                        <Main.Alert type="warning" showIcon style={{ marginBottom: 8 }}
                            message={`${warnCount} fila(s) con advertencias se cargarán igual (pase el cursor sobre "Estado" para ver el detalle).`}
                        />
                    )}
                    {errorCount > 0 && (
                        <Main.Alert type="error" showIcon style={{ marginBottom: 8 }}
                            message={`${errorCount} fila(s) no se cargarán (pase el cursor sobre "Estado" para ver el motivo).`}
                        />
                    )}

                    <Main.Table
                        columns={columns}
                        dataSource={previewData.rows}
                        rowKey="fila"
                        size="small"
                        pagination={{ pageSize: 8, size: 'small', showSizeChanger: false }}
                        scroll={{ x: 1000, y: 300 }}
                        rowClassName={r =>
                            r.status === 'error' ? 'error-row'
                                : r.status === 'warn' ? 'warn-row'
                                    : ''}
                    />
                </div>
            )}

            {/* ══════════ PASO 3: RESULTADO ═════════════════════ */}
            {step === 3 && resultData && (
                <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
                    <MainIcon.CheckCircleOutlined style={{ fontSize: 54, color: '#52c41a', marginBottom: 10 }} />
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>¡Carga completada!</div>
                    <Main.Alert type="success" showIcon={false}
                        description={
                            <div style={{ textAlign: 'left', lineHeight: 2 }}>
                                {(resultData.insertados ?? 0) > 0 && (
                                    <div>✅ <b>{resultData.insertados}</b> beneficiario(s) nuevo(s) registrado(s) como <b>Activos</b>.</div>
                                )}
                                {(resultData.reactivados ?? 0) > 0 && (
                                    <div>
                                        <MainIcon.ReloadOutlined style={{ color: '#52c41a' }} />{' '}
                                        <b>{resultData.reactivados}</b> beneficiario(s) <b>reactivado(s)</b> con datos actualizados.
                                    </div>
                                )}
                                {(resultData.inactivos ?? 0) > 0 && (
                                    <div>
                                        <MainIcon.ExclamationCircleOutlined style={{ color: '#faad14' }} />{' '}
                                        <b>{resultData.inactivos}</b> registrado(s) como <b>Inactivos</b>{' '}
                                        (activos en otra empresa — no pueden estar activos en dos empresas a la vez).
                                    </div>
                                )}
                                {(resultData.rechazados ?? 0) > 0 && (
                                    <div style={{ color: '#cf1322' }}>
                                        ⚠ <b>{resultData.rechazados}</b> rechazado(s) (ya estaban activos en esta empresa).
                                    </div>
                                )}
                                {(resultData.insertados ?? 0) === 0
                                    && (resultData.reactivados ?? 0) === 0
                                    && (resultData.inactivos ?? 0) === 0 && (
                                        <div style={{ color: '#cf1322' }}>No se procesó ningún registro nuevo.</div>
                                    )}
                            </div>
                        }
                    />
                    <p style={{ marginTop: 14, color: '#8c8c8c', fontSize: 12 }}>
                        Al cerrar, la lista de beneficiarios se actualizará automáticamente.
                    </p>
                </div>
            )}
        </Main.Modal>
    );
};

export default CargaMasivaModal;
