import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';
import '../../GestionAccesoHeader.css';

const MenusHeaderView = React.memo(({ totalMenus, onCreate, onRefresh, loading, permisos }) => {
    return (
        <div className="usuario-header">
            <div className="header-left">
                <h1 className="header-title">
                    <MainIcon.ClusterOutlined /> Catastro de Menús del Sistema
                </h1>
                <p className="header-description">
                    {loading
                        ? 'Cargando configuraciones...'
                        : `${totalMenus} menú${totalMenus !== 1 ? 's' : ''} configurado${totalMenus !== 1 ? 's' : ''}`
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
                    />

                    <Main.Button
                        type="primary"
                        icon={<MainIcon.PlusOutlined />}
                        onClick={onCreate}
                        className="btn-primary"
                        disabled={!permisos?.insert}
                    >
                        Nuevo Menú
                    </Main.Button>
                </Main.Space>
            </div>
        </div>
    );
});

export default MenusHeaderView;
