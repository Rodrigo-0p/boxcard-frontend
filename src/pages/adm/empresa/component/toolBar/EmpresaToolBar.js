import * as React from 'react';
import EmpresasToolbarView from './EmpresaToolBarView';
import './EmpresaToolBar.css';

const EmpresasToolbar = ({ onFiltersChange }) => {

  // ========================================
  // ESTADO
  // ========================================
  const [searchText   , setSearchText   ] = React.useState('');
  const [tipoFilter   , setTipoFilter   ] = React.useState('all');
  const [estadoFilter , setEstadoFilter ] = React.useState('all');
  const [vistaActual  , setVistaActual  ] = React.useState('cards'); // 'cards' o 'table'

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
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <EmpresasToolbarView
      searchText      ={ searchText         }
      tipoFilter      ={ tipoFilter         }
      estadoFilter    ={ estadoFilter       }
      vistaActual     ={ vistaActual        }
      onSearchChange  ={ handleSearchChange }
      onTipoChange    ={ handleTipoChange   }
      onEstadoChange  ={ handleEstadoChange }
      onVistaChange   ={ handleVistaChange  }
    />
  );
};

export default EmpresasToolbar;