import * as React from 'react';
import Main     from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const PersonaTableView = ({  personas
                           , loading
                           , filteredInfo
                           , onTableChange
                           , onView
                           , onEdit
                           , onDelete
                           , permisos }) => {

  const getRolConfig = (rol) => {
    const roleConfig = {
      rol_super_adm : { color: 'purple', text: 'Super Admin'   },
      rol_adm       : { color: 'blue'  , text: 'Admin'         },
      rol_cliente   : { color: 'green' , text: 'Cliente Admin' },
      rol_usuario   : { color: 'orange', text: 'Usuario Admin' },
      rol_consulta  : { color: 'yellow', text: 'Consulta Admin'}
    };
    return roleConfig[rol] || { color: 'default', text: rol };
  };

  const columns = [
    {
      title     : '',
      dataIndex : 'avatar',
      key       : 'avatar',
      width     : 50,
      align     : 'center',
      render: (_, rowdata) => {
        const userInitials = Main.generateAbbreviation(rowdata.descripcion);
        return (
          <Main.Space wrap size={11} style={{ cursor: 'pointer' }}>
            <Main.Avatar size={32} className="card-avatar-table">
              {userInitials}
            </Main.Avatar>
          </Main.Space>
        )
      },              
    },
    {
      title     : 'Nombre',
      dataIndex : 'descripcion',
      key       : 'descripcion',
      width     : 130,
      sorter    : (a, b) => a.descripcion.localeCompare(b.descripcion),
      render    : (descripcion) => (
        <span className="table-nombre">{descripcion}</span>
      ),
    },
    {
      title     : 'Usuario',
      dataIndex : 'usuario_pg',
      key       : 'usuario_pg',
      width     : 110,
    },
    {
      title     : 'Documento',
      dataIndex : 'nro_documento',
      key       : 'nro_documento',
      width     : 80,
    },
    {
      title     : 'Teléfono',
      dataIndex : 'nro_telef',
      key       : 'nro_telef',
      width     : 120,
    },
    {
      title     : 'Correo',
      dataIndex : 'correo',
      key       : 'correo',
      width     : 200,
      ellipsis  : true,
    },
    {
      title     : 'Empresa',
      dataIndex : 'empresa_nombre',
      key       : 'empresa_nombre',
      width     : 120,
    },
    {
      title    : 'Rol',
      dataIndex: 'rol_principal',
      key      : 'rol_principal',
      width    : 120,
      align    : 'center',
      filters  : [
        { text: 'Super Admin', value: 'rol_super_adm' },
        { text: 'Admin', value: 'rol_adm' },
        { text: 'Cliente Admin', value: 'rol_cliente' },
        { text: 'Usuario Admin', value: 'rol_usuario' },
        { text: 'Consulta Admin', value: 'rol_consulta' },
      ],
      filteredValue: filteredInfo.rol_principal || null,
      onFilter: (value, record) => record.rol_principal === value,
      render: (rol) => {
        const config = getRolConfig(rol);
        return (
          <Main.Tag className="table-tag-rol" color={config.color}>
            {config.text}
          </Main.Tag>
        );
      },
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 80,
      align: 'center',
      filters: [
        { text: 'Activo', value: 'A' },
        { text: 'Inactivo', value: 'I' },
      ],
      filteredValue: filteredInfo.estado || null,
      onFilter: (value, record) => record.estado === value,
      render: (estado) => (
        <Main.Tag color={estado === 'A' ? 'success' : 'default'}>
          {estado === 'A' ? 'Activo' : 'Inactivo'}
        </Main.Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 110,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Main.Space size="small">
          <Main.Button
            type="text"
            size="small"
            disabled={!permisos.view} 
            icon={<MainIcon.EyeOutlined />}
            onClick={() => onView(record)}
            className="btn-action btn-view"
          />
          <Main.Button
            type="text"
            size="small"
            disabled={!permisos?.update}
            icon={<MainIcon.EditOutlined />}
            onClick={() => onEdit(record)}
            className="btn-action btn-edit"
          />
          <Main.Button
            type="text"
            size="small"            
            disabled={!permisos.delete} 
            danger            
            icon={<MainIcon.DeleteOutlined />}
            onClick={() => onDelete(record)}
            className="btn-action btn-delete"
          />
        </Main.Space>
      ),
    },
  ];  

  return (
    <div className="personas-table-container">
      <Main.Table
        className  = "personas-table"
        columns    = {columns}
        dataSource = {personas}
        loading    = {loading}
        pagination = {false}
        onChange   = {onTableChange}
        rowKey     = "cod_persona"
        size       = "middle"
        scroll     = {{ x: 1200 }}
        bordered
      />
    </div>
  );
};

export default PersonaTableView;