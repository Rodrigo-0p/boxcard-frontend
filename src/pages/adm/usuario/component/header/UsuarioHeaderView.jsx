import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';
import './UsuarioHeader.css';

const UsuarioHeaderView = React.memo(({ totalUsuarios
    , onCreate
    , onRefresh
    , onExportar
    , loading
    , permisos }) => {
    return (
        <div className="usuario-header">

            <div className="header-left">
                <h1 className="header-title"><MainIcon.UserOutlined /> Gestión de Accesos de Usuarios</h1>
                <p className="header-description">
                    {loading
                        ? 'Cargando...'
                        : `${totalUsuarios} registro${totalUsuarios !== 1 ? 's' : ''} encontrado${totalUsuarios !== 1 ? 's' : ''}`
                    }
                </p>
            </div>

            <div className="header-right">
                <Main.Space size="small">

                    <Main.Button
                        icon={<MainIcon.DownloadOutlined />}
                        onClick={onExportar}
                        className="btn-secondary"
                    >
                        Exportar
                    </Main.Button>

                    <Main.Button
                        icon={<MainIcon.ReloadOutlined spin={loading} />}
                        onClick={onRefresh}
                        loading={loading}
                        className="btn-icon-only"
                    />

                    <Main.Button
                        type="primary"
                        icon={<MainIcon.PlusOutlined />}
                        onClick={onCreate}
                        className="btn-primary"
                        disabled={!permisos?.insert}
                    >
                        Nuevo Acceso
                    </Main.Button>
                </Main.Space>
            </div>

        </div>
    );
});

export default UsuarioHeaderView;
