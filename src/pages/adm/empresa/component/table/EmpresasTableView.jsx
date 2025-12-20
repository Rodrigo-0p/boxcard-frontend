import * as React from 'react';
import Main     from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const EmpresasTableView = ({  empresas
                            , loading
                            , filteredInfo
                            , onTableChange
                            , onView
                            , onEdit
                            , onDelete
                            , permisos }) => {

  const columns = [
    {
      title     : '',
      dataIndex : 'logo',
      key       : 'logo',
      width     : 50,
      align     : 'center',
      render: (logo, rowdata) => {
        const userInitials = Main.generateAbbreviation(rowdata.nombre);
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
      dataIndex : 'nombre',
      key       : 'nombre',
      sorter    : (a, b) => a.nombre.localeCompare(b.nombre),
      render    : (nombre) => (
        <span className="table-nombre">{nombre}</span>
      ),
    },
    {
      title     : 'RUC',
      dataIndex : 'ruc',
      key       : 'ruc',
      width     : 130,
    },
    {
      title    : 'Tipo',
      dataIndex: 'tip_empresa',
      key      : 'tip_empresa',
      width    : 120,
      align    : 'center',
      filters  : [
        { text: 'Nómina', value: 'N' },
        { text: 'Beneficiario', value: 'B' },
      ],
      filteredValue: filteredInfo.tip_empresa || null,
      onFilter: (value, record) => record.tip_empresa === value,
      render: (tipo) => (
        <Main.Tag className="table-tag-tipo" color={`${tipo === 'N' ? 'blue' : 'magenta'}`} >
          {tipo === 'N' ? 'Nómina' : 'Beneficiario'}
        </Main.Tag>
      ),
    },
    {
      title     : 'Modalidad',
      dataIndex : 'modalidad',
      key       : 'modalidad',
      width     : 120,
      align     : 'center',
      filters: [
        { text: 'Prepago', value: 'PRE' },
        { text: 'Postpago', value: 'POS' },
      ],
      filteredValue: filteredInfo.modalidad || null,
      onFilter: (value, record) => record.modalidad === value,
      render: (modalidad) => (
        <Main.Tag className="table-tag-modalidad" color={`${modalidad === 'PRE' ? 'green' : 'gold'}`}>
          {modalidad === 'PRE' ? 'Prepago' : 'Postpago'}
        </Main.Tag>
      ),
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
      width: 150,
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
    <div className="empresas-table-container">
      <Main.Table
        className  = "empresas-table"
        columns    = {columns}
        dataSource = {empresas}
        loading    = {loading}
        pagination = {false}
        onChange   = {onTableChange}
        rowKey     = "cod_empresa"
        size       = "middle"
        scroll     = {{ x: 100 }}
        bordered
      />
    </div>
  );
};

export default EmpresasTableView;