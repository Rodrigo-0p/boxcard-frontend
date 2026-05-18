import * as React from 'react';
import Main from '../../../../../../util/main';
import MenusTableView from './MenusTableView';

const MenusTable = ({ data, loading, onEdit, onDelete, permisos }) => {
    
    // Función para organizar los datos en modo jerárquico si es necesario
    // Por ahora usamos la tabla plana con sangría
    
    return (
        <MenusTableView
            data={data}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
            permisos={permisos}
        />
    );
};

export default MenusTable;
