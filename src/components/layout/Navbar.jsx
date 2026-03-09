import { useState } from 'react';
import { Layout, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import MainIcon from '../../util/mainIcon';
import { useAuth } from '../../context/AuthContext';
import Main from '../../util/main';
import ProfileModal from './ProfileModal';
import './styles/Navbar.css';


const { Header } = Layout;
const { Text } = Typography;

const Navbar = ({ collapsed, setCollapsed }) => {
  const { nombre, logout } = useAuth();
  const [profileVisible, setProfileVisible] = useState(false);

  const userInitials = Main.generateAbbreviation(nombre);

  const handleLogout = () => {
    logout();
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <MainIcon.UserOutlined />,
      label: 'Ajustes de Perfil',
      onClick: () => setProfileVisible(true),
    },
    {
      key: 'logout',
      icon: <MainIcon.LogoutOutlined />,
      label: 'Cerrar Sesión',
      onClick: handleLogout,
    },
  ];

  const clollapsed = () => {
    sessionStorage.setItem("collapsed", !collapsed);
    setCollapsed(!collapsed);
  }

  return (
    <Header style={{
      padding: '0 24px',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
    }}>

      <Button
        type="text"
        className='buttonSider'
        icon={collapsed ? <MainIcon.MenuUnfoldOutlined /> : <MainIcon.MenuFoldOutlined />}
        onClick={clollapsed}
      />

      <Dropdown
        menu={{ items: userMenuItems }}
        placement="bottomRight"
        arrow
      >
        <div className="user-info">
          <Space wrap size={10} style={{ cursor: 'pointer' }}>
            <Avatar className="user-avatar" >
              {userInitials}
            </Avatar>
            <Text strong>{nombre}</Text>
          </Space>
        </div>

      </Dropdown>

      <ProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
      />
    </Header>
  );
};

export default Navbar;