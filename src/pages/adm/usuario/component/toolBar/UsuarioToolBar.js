import * as React from 'react';
import UsuarioToolbarView from './UsuarioToolbarView';
import './UsuarioToolBar.css';

const UsuarioToolbar = ({ onFiltersChange }) => {

    const [searchText, setSearchText] = React.useState('');
    const [estadoFilter, setEstadoFilter] = React.useState('all');
    const [vistaActual, setVistaActual] = React.useState('cards');



    const handleSearchChange = (value) => {
        setSearchText(value);
        notifyFiltersChange({ searchText: value, estadoFilter, vistaActual });
    };

    const handleEstadoChange = (value) => {
        setEstadoFilter(value);
        notifyFiltersChange({ searchText, estadoFilter: value, vistaActual });
    };


    const handleVistaChange = (vista) => {
        setVistaActual(vista);
        notifyFiltersChange({ searchText, estadoFilter, vistaActual: vista });
    };


    const notifyFiltersChange = (filters) => {
        if (onFiltersChange) {
            onFiltersChange(filters);
        }
    };

    return (
        <UsuarioToolbarView
            searchText={searchText}
            estadoFilter={estadoFilter}
            vistaActual={vistaActual}
            onSearchChange={handleSearchChange}
            onEstadoChange={handleEstadoChange}
            onVistaChange={handleVistaChange}

        />
    );
};

export default UsuarioToolbar;
