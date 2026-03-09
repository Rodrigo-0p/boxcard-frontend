import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const ConfirmacionToolbar = ({ onFiltersChange }) => {
    const [searchText, setSearchText] = React.useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (onFiltersChange) {
            onFiltersChange({ searchText: value });
        }
    };

    return (
        <div className="empresas-toolbar" style={{ marginBottom: '24px' }}>
            <div className="toolbar-left">
                <Main.Input
                    placeholder="Buscar por Nro, Empresa o Solicitante..."
                    allowClear
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<MainIcon.SearchOutlined style={{ color: '#bfbfbf' }} />}
                    className="search-input"
                    style={{ width: '350px' }}
                />
            </div>
            <div className="toolbar-right">
                {/* Por ahora solo filtro por texto libre ya que todas son pendientes */}
            </div>
        </div>
    );
};

export default ConfirmacionToolbar;
