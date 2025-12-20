
import * as React from 'react';
import Main       from '../../../../../util/main';
import MainIcon   from '../../../../../util/mainIcon';

const { Option } = Main.Select;

const PersonasToolbarView =({ searchText
                            , tipoFilter 
                            , estadoFilter
                            , vistaActual
                            , onSearchChange
                            , onTipoChange
                            , onEstadoChange
                            , onVistaChange
                             }) => {
  return (
    <div className="persona-toolbar">
      
      <div className="toolbar-left">
        <Main.Input
          placeholder="Buscar por nombre, usuario o documento..."
          prefix={<MainIcon.SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          className="search-input"
        />
      </div>

      <div className="toolbar-right">
        <Main.Space size="small">
         
          <Main.Select
            value={tipoFilter}
            onChange={onTipoChange}
            style={{ width: 140 }}
            suffixIcon={<MainIcon.FilterOutlined />}
          >
            <Option value="all">Todos los roles</Option>
            <Option value="rol_super_adm">Super Admin</Option>
            <Option value="rol_adm">Admin</Option>
            <Option value="rol_cliente">Cliente</Option>
            <Option value="rol_usuario">Usuario</Option>
            <Option value="rol_consulta">Consulta</Option>
          </Main.Select>

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
};

export default PersonasToolbarView;