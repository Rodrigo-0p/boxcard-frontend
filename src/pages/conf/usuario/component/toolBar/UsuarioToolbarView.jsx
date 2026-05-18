import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const { Option } = Main.Select;

const UsuarioToolbarView = ({ searchText
    , estadoFilter
    , vistaActual
    , onSearchChange
    , onEstadoChange
    , onVistaChange
}) => {
    return (
        <div className="usuario-toolbar">

            <div className="toolbar-left">
                <Main.Input
                    placeholder="Buscar por nombre, usuario o documento..."
                    prefix={<MainIcon.SearchOutlined />}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    allowClear
                    className="search-input"
                />
            </div>

            <div className="toolbar-right">
                <Main.Space size="small">


                    <Main.Select
                        value={estadoFilter}
                        onChange={onEstadoChange}
                        style={{ width: 120 }}
                        suffixIcon={<MainIcon.FilterOutlined />}
                    >
                        <Option value="all">Todos</Option>
                        <Option value="A">Activos</Option>
                        <Option value="I">Inactivos</Option>
                    </Main.Select>


                </Main.Space>
            </div>
        </div>
    );
};

export default UsuarioToolbarView;
