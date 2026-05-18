import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';

const { Option } = Main.Select;

const MenusToolBarView = ({ searchText, estadoFilter, onSearchChange, onEstadoChange }) => {
    return (
        <div className="usuario-toolbar" style={{ marginBottom: '16px' }}>
            <div className="toolbar-left">
                <Main.Input
                    placeholder="Buscar menú por nombre o ruta..."
                    prefix={<MainIcon.SearchOutlined />}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    allowClear
                    className="search-input"
                    style={{ width: 350 }}
                />
            </div>

            <div className="toolbar-right">
                <Main.Space size="small">
                    <Main.Select
                        value={estadoFilter}
                        onChange={onEstadoChange}
                        style={{ width: 150 }}
                        suffixIcon={<MainIcon.FilterOutlined />}
                    >
                        <Option value="all">Todos los Estados</Option>
                        <Option value="A">Activos</Option>
                        <Option value="I">Inactivos</Option>
                    </Main.Select>
                </Main.Space>
            </div>
        </div>
    );
};

export default MenusToolBarView;
