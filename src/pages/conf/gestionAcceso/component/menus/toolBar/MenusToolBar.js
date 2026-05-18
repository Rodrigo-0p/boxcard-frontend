import * as React from 'react';
import Main from '../../../../../../util/main';
import MenusToolBarView from './MenusToolBarView';

const MenusToolBar = ({ onFiltersChange }) => {
    const [searchText, setSearchText] = React.useState('');
    const [estadoFilter, setEstadoFilter] = React.useState('all');

    const handleSearchChange = (value) => {
        setSearchText(value);
        if (onFiltersChange) onFiltersChange({ searchText: value, estadoFilter });
    };

    const handleEstadoChange = (value) => {
        setEstadoFilter(value);
        if (onFiltersChange) onFiltersChange({ searchText, estadoFilter: value });
    };

    return (
        <MenusToolBarView
            searchText={searchText}
            estadoFilter={estadoFilter}
            onSearchChange={handleSearchChange}
            onEstadoChange={handleEstadoChange}
        />
    );
};

export default MenusToolBar;
