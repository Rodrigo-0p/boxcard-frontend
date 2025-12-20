import { Typography } from 'antd';
import { useAuth } from '../../../context/AuthContext';
import MainLayout from '../../../components/layout/MainLayout';

const { Title } = Typography;

const Dashboard = () => {
  const { nombre } = useAuth();

  return (
    <MainLayout selectedMenuKey="1">
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Title level={2}>¡Hola Mundo!</Title>
        <p>Bienvenido al sistema BoxCard</p>
        <p>Usuario: <strong>{nombre}</strong></p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;