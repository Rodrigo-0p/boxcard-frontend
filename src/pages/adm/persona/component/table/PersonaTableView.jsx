import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const PersonaTableView = ({ personas
  , loading
  , filteredInfo
  , onTableChange
  , onView
  , onEdit
  , onDelete
  , permisos }) => {

  const columns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 50,
      align: 'center',
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
      title: 'Nombre',
      dataIndex: 'descripcion',
      key: 'descripcion',
      width: 180,
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (descripcion) => (
        <span className="table-nombre">{descripcion}</span>
      ),
    },
    {
      title: 'Documento',
      dataIndex: 'nro_documento',
      key: 'nro_documento',
      width: 100,
    },
    {
      title: 'Teléfono',
      dataIndex: 'nro_telef',
      key: 'nro_telef',
      width: 120,
    },
    {
      title: 'Correo',
      dataIndex: 'correo',
      key: 'correo',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Empresa',
      dataIndex: 'empresa_nombre',
      key: 'empresa_nombre',
      width: 150,
    },
    {
      title: 'Creado por',
      dataIndex: 'usuario_alta',
      key: 'usuario_alta',
      width: 120,
      render: (text) => <span style={{ fontSize: '12px' }}>{text || '-'}</span>
    },
    {
      title: 'Modif. por',
      dataIndex: 'usuario_mod',
      key: 'usuario_mod',
      width: 120,
      render: (text) => <span style={{ fontSize: '12px' }}>{text || '-'}</span>
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 100,
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
        className="personas-table"
        columns={columns}
        dataSource={personas}
        loading={loading}
        pagination={false}
        onChange={onTableChange}
        rowKey="cod_persona"
        size="middle"
        scroll={{ x: 1000 }}
        bordered
      />
    </div>
  );
};

export default PersonaTableView;