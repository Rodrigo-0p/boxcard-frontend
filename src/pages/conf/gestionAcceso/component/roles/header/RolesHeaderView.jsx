import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';
import '../../GestionAccesoHeader.css';

const RolesHeaderView = React.memo(({ loading, saving, onRefresh, onSave, onCancel, selectedRole, permisos, dirtyCount }) => {
    return (
        <div className="usuario-header">
            <div className="header-left">
                <h1 className="header-title">
                    <MainIcon.SafetyCertificateOutlined /> Asignación de Permisos por Rol
                </h1>
                <p className="header-description">
                    {dirtyCount > 0 
                        ? (<span>Tiene <b style={{ color: '#fa8c16' }}>{dirtyCount}</b> roles con cambios pendientes de guardar.</span>)
                        : (selectedRole 
                            ? (<span>Configurando accesos para el rol: <b style={{ color: '#1890ff' }}>{selectedRole}</b></span>)
                            : 'Seleccione un rol de la lista para gestionar sus permisos de acceso.'
                        )
                    }
                </p>
            </div>

            <div className="header-right">
                <Main.Space size="small">
                    <Main.Button
                        icon={<MainIcon.ReloadOutlined spin={loading} />}
                        onClick={onRefresh}
                        loading={loading}
                        className="btn-icon-only"
                        title="Refrescar datos"
                    />

                    {dirtyCount > 0 && (
                        <Main.Button
                            icon={<MainIcon.HistoryOutlined />}
                            onClick={onCancel}
                            className="btn-secondary"
                            title="Revertir todos los cambios no guardados"
                        >
                            {dirtyCount > 1 ? 'Revertir Todo' : 'Deshacer'}
                        </Main.Button>
                    )}

                    <Main.Badge count={dirtyCount} offset={[-10, 0]}>
                        <Main.Button
                            type="primary"
                            icon={<MainIcon.SaveOutlined />}
                            onClick={onSave}
                            loading={saving}
                            className="btn-primary"
                            disabled={dirtyCount === 0 || !permisos?.update}
                            style={{ 
                                backgroundColor: dirtyCount > 1 ? '#fa8c16' : undefined,
                                borderColor: dirtyCount > 1 ? '#fa8c16' : undefined
                            }}
                        >
                            {dirtyCount > 1 ? 'Guardar Todo' : 'Guardar Cambios'}
                        </Main.Button>
                    </Main.Badge>
                </Main.Space>
            </div>
        </div>
    );
});

export default RolesHeaderView;
