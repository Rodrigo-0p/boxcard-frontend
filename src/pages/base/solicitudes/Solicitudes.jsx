import { Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MainLayout from '../../../components/layout/MainLayout';

const { Title } = Typography;

const Solicitudes = () => {
  
  return (
    <MainLayout selectedMenuKey="2">
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px' 
        }}>
          <Title level={2} style={{ margin: 0 }}>Solicitudes</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => console.log('Nueva solicitud')}
          >
            Nueva Solicitud
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Solicitudes;