import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const SolicitudToolbar = ({ onFiltersChange }) => {
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
        <div className="empresas-toolbar" style={{ marginBottom: '24px' }}>
            <div className="toolbar-left">
                <Main.Input
                    placeholder="Buscar por Nro, Empresa o Solicitante..."
                    allowClear
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    prefix={<MainIcon.SearchOutlined style={{ color: '#bfbfbf' }} />}
                    className="search-input"
                    style={{ width: '350px' }}
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
                            { value: 'B', label: 'Borrador' },
                            { value: 'P', label: 'Pendiente a Confirmar' },
                            { value: 'C', label: 'Confirmada' },
                            { value: 'R', label: 'Rechazada' },
                            { value: 'A', label: 'Anulada' },
                        ]}
                    />
                </Main.Space>
            </div>
        </div>
    );
};

export default SolicitudToolbar;
