import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const BeneficiariosHeaderView = ({
    totalBeneficiarios,
    loading,
    onRefresh,
    onExportar,
    onDescargarModelo,
    onImportar,
    onNuevo
}) => {
    return (
        <div className="empresas-header">
            <div className="header-left">
                <h1 className="header-title">
                    <MainIcon.TeamOutlined /> Gestión de Beneficiarios
                </h1>
                <p className="header-description">
                    {loading
                        ? 'Cargando...'
                        : `${totalBeneficiarios} beneficiario${totalBeneficiarios !== 1 ? 's' : ''} registrado${totalBeneficiarios !== 1 ? 's' : ''}`
                    }
                </p>
            </div>

            <div className="header-right">
                <Main.Space size="small">
                    <Main.Button
                        type="primary"
                        icon={<MainIcon.UserAddOutlined />}
                        onClick={onNuevo}
                    >
                        Nuevo Beneficiario
                    </Main.Button>

                    <Main.Button
                        icon={<MainIcon.UploadOutlined />}
                        onClick={onImportar}
                    >
                        Carga Masiva
                    </Main.Button>

                    <Main.Button
                        icon={<MainIcon.FileExcelOutlined />}
                        onClick={onDescargarModelo}
                        style={{ color: '#107c10', borderColor: '#107c10' }}
                    >
                        Plantilla
                    </Main.Button>

                    <Main.Button
                        icon={<MainIcon.DownloadOutlined />}
                        onClick={onExportar}
                        className="btn-secondary"
                    >
                        Exportar Listado
                    </Main.Button>

                    <Main.Button
                        icon={<MainIcon.ReloadOutlined spin={loading} />}
                        onClick={onRefresh}
                        loading={loading}
                        className="btn-icon-only"
                    />
                </Main.Space>
            </div>
        </div>
    );
};

export default BeneficiariosHeaderView;
