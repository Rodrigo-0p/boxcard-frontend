import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';

const EspecialToolBar = ({ onFiltersChange }) => {
    const [searchText, setSearchText] = React.useState('');

    const handleSearch = (value) => {
        setSearchText(value);
        onFiltersChange({ searchText: value });
    };

    return (
        <div className="usuario-toolbar" style={{ marginBottom: '16px' }}>
            <div className="toolbar-left">
                <Main.Input
                    placeholder="Buscar usuario por nombre o ID de acceso..."
                    prefix={<MainIcon.SearchOutlined />}
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    allowClear
                    className="search-input"
                    style={{ width: 400 }}
                />
            </div>
            <div className="toolbar-right">
                {/* Opcional: Filtros adicionales si se requieren */}
            </div>
        </div>
    );
};

export default EspecialToolBar;
