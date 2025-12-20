import * as React from 'react';
import MainIcon from '../../../../../util/mainIcon';
import Main     from '../../../../../util/main';
const { Option } = Main.Select;

const EmpresaToolBarView = React.memo(({  searchText
                                        , tipoFilter
                                        , estadoFilter
                                        , vistaActual
                                        , onSearchChange
                                        , onTipoChange
                                        , onEstadoChange
                                        , onVistaChange
                                        }) => {
  return (
    <div className="empresas-toolbar">
      
      {/* Lado Izquierdo - Búsqueda */}
      <div className="toolbar-left">
        <Main.Input
          placeholder="Buscar por nombre o RUC..."
          prefix={<MainIcon.SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          className="search-input"
        />
      </div>
      
      {/* Lado Derecho - Filtros y Vista */}
      <div className="toolbar-right">
        <Main.Space size="small">
          {/* Filtro por Tipo */}
          <Main.Select
            value={tipoFilter}
            onChange={onTipoChange}
            style={{ width: 140 }}
            suffixIcon={<MainIcon.FilterOutlined />}
          >
            <Option value="all">Todos los tipos</Option>
            <Option value="N">Nómina</Option>
            <Option value="B">Beneficiario</Option>
          </Main.Select>

          {/* Filtro por Estado */}
          <Main.Select
            value={estadoFilter}
            onChange={onEstadoChange}
            style={{ width: 120 }}
            suffixIcon={<MainIcon.FilterOutlined />}
          >
            <Option value="all">Todos</Option>
            <Option value="A">Activos</Option>
            <Option value="I">Inactivos</Option>
          </Main.Select>

          {/* Toggle Vista */}
          <div className="view-toggle">
            <Main.Button
              type={vistaActual === 'cards' ? 'primary' : 'default'}
              icon={<MainIcon.AppstoreOutlined />}
              onClick={() => onVistaChange('cards')}
              className="view-btn"
            />
            <Main.Button
              type={vistaActual === 'table' ? 'primary' : 'default'}
              icon={<MainIcon.UnorderedListOutlined />}
              onClick={() => onVistaChange('table')}
              className="view-btn"
            />
          </div>
        </Main.Space>
      </div>

    </div>
  );
});

export default EmpresaToolBarView;