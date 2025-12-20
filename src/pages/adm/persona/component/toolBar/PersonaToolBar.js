import * as React from 'react';
import PersonasToolbarView from './PersonasToolbarView';
import './PersonaToolBar.css'

const PersonasToolbar = ({ onFiltersChange }) => {

  const [ searchText   , setSearchText   ] = React.useState('');
  const [ tipoFilter   , setTipoFilter   ] = React.useState('all');
  const [ estadoFilter , setEstadoFilter ] = React.useState('all');
  const [ vistaActual  , setVistaActual  ] = React.useState('cards'); // 'cards' o 'table'
  
  // ========================================
  // HANDLERS
  // ========================================
  const handleSearchChange = (value) => {
    setSearchText(value);
    notifyFiltersChange({ 
      searchText: value, 
      tipoFilter, 
      estadoFilter, 
      vistaActual 
    });
  };

  const handleTipoChange = (value) => {
    setTipoFilter(value);
    notifyFiltersChange({ 
      searchText, 
      tipoFilter: value, 
      estadoFilter, 
      vistaActual 
    });
  };

  const handleEstadoChange = (value) => {
    setEstadoFilter(value);
    notifyFiltersChange({ 
      searchText, 
      tipoFilter, 
      estadoFilter: value, 
      vistaActual 
    });
  };

  const handleVistaChange = (vista) => {
    setVistaActual(vista);
    notifyFiltersChange({
      searchText, 
      tipoFilter, 
      estadoFilter, 
      vistaActual: vista 
    });
  };

  // Notificar cambios al padre
  const notifyFiltersChange = (filters) => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };;

  return (
    <PersonasToolbarView
      searchText     ={ searchText         }
      tipoFilter     ={ tipoFilter         }
      estadoFilter   ={ estadoFilter       }
      vistaActual    ={ vistaActual        }
      onSearchChange ={ handleSearchChange }
      onTipoChange   ={ handleTipoChange   }
      onEstadoChange ={ handleEstadoChange }
      onVistaChange  ={ handleVistaChange  }
    />
  );
};

export default PersonasToolbar;