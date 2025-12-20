import Main     from '../../../util/main';
import MainIcon from '../../../util/mainIcon';
import { useAuth } from '../../../context/AuthContext';
import { Modal, Card, Avatar, Spin, Empty} from 'antd';
import './Empresaselectormodal.css';

const EmpresaSelectorModal = ({ visible, onClose, empresas= [], empresaActual = '', loading, setLoading}) => {
  const message = Main.useMessage();

  const {updateEmpresa} = useAuth()
  const handleSelectEmpresa = async (vempresa) => {
    try {
      // No cambiar si ya está en esa empresa
      if (vempresa.cod_empresa === empresaActual) {
        message.info('Ya se encuentra en esta empresa');
        return;
      }  

      setLoading(true);
      Main.Request('/bs/updateEmpresa', 'POST',vempresa || {}).then((resp)=>{
        if(resp.data.success){                  
          updateEmpresa(vempresa,resp.data.datas.token).then(()=>{
            message.success(resp.data.message || 'Procesado!');
            onClose()
          });
        }else{
          message.info(resp.data.datas.message || 'Error al cargar empresas');
        }        
      });      
    } catch (error) {
      console.log(error);
      setLoading(false);
    }finally{
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            background: '#001529',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <MainIcon.ShopOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#001529' }}>Seleccionar Empresa</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c' }}>
              Elija la empresa con la que desea trabajar
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className="empresa-selector-modal"
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large">
            <div style={{color:'#001529'}}>Cargando empresas...</div>
          </Spin>
        </div>
      ) : empresas.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No hay empresas disponibles"
          style={{ padding: '40px 0' }}
        />
      ) : (
        <div className="empresas-grid">
          {empresas.map((empresa) => (
            <Card
              key={empresa.cod_empresa}
              hoverable={!empresa.cod_empresa}
              className={`empresa-card ${empresaActual === empresa.cod_empresa ? 'current' : ''}`}
              onClick={() =>handleSelectEmpresa(empresa)}
              style={{ position: 'relative' }}
            >
              {/* Badge de empresa actual */}
              {empresaActual === empresa.cod_empresa && (
                <div className="current-badge">
                  <MainIcon.CheckCircleFilled style={{ marginRight: 4, fontSize: 12 }} />
                  Actual
                </div>
              )}

              <div className="empresa-card-content">
                
                {/* Logo */}
                <div className="empresa-logo-section">
                  <Avatar
                    size={48}
                    src={empresa.logo ? `/uploads/logos/${empresa.logo}` : null}
                    icon={!empresa.logo && <MainIcon.BankOutlined />}
                    style={{
                      background: empresa.logo ? 'transparent' : '#001529',
                      border: '2px solid #f5f5f5'
                    }}
                  />
                </div>
                {/* Información */}
                <div className="empresa-info">
                  <h3 className="empresa-nombre">{empresa.empresa}</h3>
                  <div className="empresa-ruc">RUC: {empresa.ruc}</div>
                  
                  <div className="empresa-tags">
                    {/* <Tag 
                      color={empresa.tip_empresa === 'N' ? 'default' : 'default'}
                      style={{ 
                        marginRight: 4,
                        fontSize: 11,
                        background: '#f5f5f5',
                        color: '#001529',
                        border: '1px solid #d9d9d9'
                      }}
                    >
                      {empresa.tip_empresa === 'N' ? 'Nómina' : 'Beneficiario'}
                    </Tag> */}
                    {/* <Tag 
                      style={{ 
                        fontSize: 11,
                        background: '#f5f5f5',
                        color: '#001529',
                        border: '1px solid #d9d9d9'
                      }}
                    >
                      {empresa.modalidad === 'PRE' ? 'Prepago' : 'Postpago'}
                    </Tag> */}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default EmpresaSelectorModal;