import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const BeneficiariosToolbar = ({ onFiltersChange }) => {

    const [searchText, setSearchText] = React.useState('');
    const [estadoFilter, setEstadoFilter] = React.useState('all');

    const emitFilters = (overrides = {}) => {
        const filters = {
            searchText,
            estadoFilter,
            ...overrides
        };
        if (onFiltersChange) onFiltersChange(filters);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        emitFilters({ searchText: value });
    };

    const handleEstado = (value) => {
        setEstadoFilter(value);
        emitFilters({ estadoFilter: value });
    };

    return (
        <div className="empresas-toolbar">
            <div className="toolbar-left">
                <Main.Input
                    placeholder="Buscar por nombre, documento, correo..."
                    allowClear
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    prefix={<MainIcon.SearchOutlined />}
                    className="search-input"
                />
            </div>
            <div className="toolbar-right">
                <Main.Space size="small" wrap>
                    <Main.Select
                        value={estadoFilter}
                        onChange={handleEstado}
                        style={{ minWidth: 160 }}
                        options={[
                            { value: 'all', label: 'Todos los estados' },
                            { value: 'A', label: 'Activos' },
                            { value: 'I', label: 'Inactivos' },
                        ]}
                    />
                </Main.Space>
            </div>
        </div>
    );
};

export default BeneficiariosToolbar;
