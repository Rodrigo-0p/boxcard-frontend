import React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const SolicitudReporteTable = ({ solicitudes, loading, onView }) => {

    const columns = [
        {
            title: 'Nro. Solicitud',
            dataIndex: 'nro_solicitud',
            key: 'nro_solicitud',
            width: 110,
            align: 'center',
            render: (text) => (
                <span style={{ fontWeight: 700, color: '#475569' }}>
                    SOL-{text}
                </span>
            )
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha_creacion',
            key: 'fecha_creacion',
            width: 100,
            align: 'center',
            render: (date) => Main.formatDate(date).split(' ')[0]
        },
        {
            title: 'Empresa Destino',
            dataIndex: 'nombre_empresa_dest',
            key: 'nombre_empresa_dest',
            width: 180,
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            render: (text) => (
                <div style={{ color: '#475569', fontSize: '12px', lineHeight: '1.4' }}>
                    {text || '-'}
                </div>
            )
        },
        {
            title: 'Monto',
            dataIndex: 'monto_solicitado',
            key: 'monto_solicitado',
            width: 130,
            align: 'right',
            render: (monto) => <span style={{ fontWeight: 600, color: '#3f9635' }}>{Main.formatCurrency(monto)}</span>
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            width: 80,
            align: 'center',
            render: (estado) => {
                const config = Main.estadosSolicitud[estado] || { color: 'default', text: estado };
                const Icon = MainIcon ? MainIcon[config.icon] : null;
                return (
                    <Main.Tooltip title={config.text}>
                        <div style={{
                            background: config.color === 'processing' ? '#e6f4ff' :
                                config.color === 'success' ? '#f6ffed' :
                                    config.color === 'error' ? '#fff2f0' :
                                        config.color === 'warning' ? '#fffbe6' : '#f5f5f5',
                            color: config.color === 'processing' ? '#0958d9' :
                                config.color === 'success' ? '#389e0d' :
                                    config.color === 'error' ? '#cf1322' :
                                        config.color === 'warning' ? '#d48806' : '#595959',
                            width: '32px', height: '32px', borderRadius: '6px', fontSize: '16px',
                            border: '1px solid', fontWeight: 600,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            borderColor: config.color === 'processing' ? '#91caff' :
                                config.color === 'success' ? '#b7eb8f' :
                                    config.color === 'error' ? '#ffa39e' :
                                        config.color === 'warning' ? '#ffe58f' : '#d9d9d9',
                            cursor: 'help'
                        }}>
                            {Icon && <Icon />}
                        </div>
                    </Main.Tooltip>
                );
            }
        },
        {
            title: 'Motivo / Observación',
            dataIndex: 'motivo_rechazo',
            key: 'motivo_rechazo',
            width: 250,
            render: (text, record) => {
                if (record.estado === 'R') {
                    return <span style={{ color: '#cf1322', fontWeight: 600, fontSize: '11px' }}>{text || 'Sin motivo especificado'}</span>;
                }
                if (record.estado === 'A') {
                    return <span style={{ color: '#d48806', fontSize: '11px' }}>{record.observaciones || text || '-'}</span>;
                }
                return <span style={{ color: '#8c8c8c' }}>-</span>;
            }
        },
        {
            title: 'Nro. Comprobante',
            dataIndex: 'nro_comprobante',
            key: 'nro_comprobante',
            width: 150,
            align: 'center',
            render: (text) => text ? (
                <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'inline-block'
                }}>
                    {text}
                </span>
            ) : <span style={{ color: '#bfbfbf' }}>-</span>
        },
        {
            title: 'Doc',
            dataIndex: 'url_comprobante',
            key: 'url_comprobante',
            width: 60,
            align: 'center',
            render: (url) => url ? (
                <a href={`${process.env.REACT_APP_BASEURL}${url}`} target="_blank" rel="noopener noreferrer">
                    <MainIcon.FilePdfOutlined style={{ fontSize: '18px', color: '#ff4d4f' }} />
                </a>
            ) : '-'
        }
    ];

    return (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} style={{ padding: '10px 12px', fontWeight: 600, color: '#434343', width: col.width, textAlign: col.align || 'left' }}>
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: '#8c8c8c' }}>Cargando...</td></tr>
                    ) : solicitudes?.length === 0 ? (
                        <tr><td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: '#8c8c8c' }}>No se encontraron solicitudes</td></tr>
                    ) : (
                        solicitudes?.map((row, idx) => (
                            <tr key={row.cod_solicitud || idx} style={{ borderBottom: '1px solid #f5f5f5' }} className="table-row-hover">
                                {columns.map(col => (
                                    <td key={col.key} style={{ padding: '8px 12px', textAlign: col.align || 'left', verticalAlign: 'middle' }}>
                                        {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SolicitudReporteTable;
