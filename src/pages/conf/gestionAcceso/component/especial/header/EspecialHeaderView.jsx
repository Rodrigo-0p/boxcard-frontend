import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';
import '../../GestionAccesoHeader.css';

const EspecialHeaderView = React.memo(({ loading, onRefresh, onSave, onCancel, dirtyCount, permisos }) => {
    return (
        <div className="usuario-header">
            <div className="header-left">
                <h1 className="header-title">
                    <MainIcon.UserAddOutlined /> ESTRUCTURA DE NAVEGACIÓN
                </h1>
                <p className="header-description">
                    {loading
                        ? 'Actualizando estructura...'
                        : `Personalice el acceso a menús de forma individual para cada usuario.`
                    }
                </p>
            </div>

            <div className="header-right">
                <Main.Space size="small">
                    {dirtyCount > 0 && (
                        <Main.Button
                            icon={<MainIcon.HistoryOutlined />}
                            onClick={onCancel}
                            disabled={loading}
                            className="btn-secondary"
                        >
                            Deshacer
                        </Main.Button>
                    )}

                    <Main.Button
                        icon={<MainIcon.ReloadOutlined spin={loading} />}
                        onClick={onRefresh}
                        loading={loading}
                        className="btn-icon-only"
                    />

                    <Main.Button
                        type="primary"
                        icon={<MainIcon.SaveOutlined />}
                        onClick={onSave}
                        className="btn-primary"
                        disabled={!permisos?.update || dirtyCount === 0}
                        loading={loading}
                    >
                        {dirtyCount > 1 ? `Guardar (${dirtyCount})` : 'Guardar Cambios'}
                    </Main.Button>
                </Main.Space>
            </div>
        </div>
    );
});

export default EspecialHeaderView;
