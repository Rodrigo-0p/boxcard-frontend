import * as React           from 'react';
import { Layout, Menu, Tooltip }      from 'antd';
import { NavLink }          from 'react-router-dom';
import boxCard              from '../../assets/icons/svg/boxCard.png';
import MainIcon             from '../../util/mainIcon'
import Main                 from '../../util/main';
import EmpresaSelectorModal from './selectModalEmpresa/Empresaselectormodal';
import { useAuth }          from '../../context/AuthContext';
const { Sider } = Layout;
import './styles/LeftSidebar.css';


const transformMenuData = (menuData) => {
  if (!menuData || !Array.isArray(menuData)) return [];
  
  return menuData.map((item) => {
    const menuItem = {
      key: item.key,
      icon: MainIcon.iconMap[item.icon] || <MainIcon.AppstoreOutlined />,
      label: item.path ? (
        <NavLink to={item.path} style={{ color: 'inherit', textDecoration: 'none' }}>
          {item.label}
        </NavLink>
      ) : (
        item.label
      )
    };
    
    if (item.children && item.children.length > 0) {
      menuItem.children = transformMenuData(item.children);
    }
    
    return menuItem;
  });
};

const siderStyle = {
  overflow         : 'auto',
  height           : '100vh',
  position         : 'sticky',
  insetInlineStart : 0,
  top              : 0,
  bottom           : 0,
  scrollbarWidth   : 'thin',
  scrollbarGutter  : 'stable',
};

const LeftSidebar = ({ collapsed, selectedMenuKey, openMenuKeys }) => {
  const { menus, empresa, logoUrl} = useAuth(); 
  const menuItems = transformMenuData(menus); 
  const message   = Main.useMessage()

  const [openKeys     , setOpenKeys     ] = React.useState(openMenuKeys || []);
  const [modalVisible , setModalVisible ] = React.useState(false);
  const [empresas     , setEmpresas     ] = React.useState([]);
  const [empresaActual, setEmpresaActual] = React.useState(null);
  const [loading      , setLoading      ] = React.useState(false);
  
  // Manejar APERTURA/CIERRE de SUB-MENÚS
  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const loadEmpresas = async () => {
    setLoading(true);
    try {
      const response = await Main.Request('/bs/infoEmpresas', 'GET',{},message);
      
      if (response.data && response.data.success) {
        setEmpresas(response.data.datas.empresas);
        setEmpresaActual(response.data.datas.empresa_actual);
        setModalVisible(true);
      } else {
        message.info(response.data.message || 'Error al cargar empresas');
      }
    } catch (error) {
      console.error('Error cargando empresas:', error);
      message.error('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };
  const text = <span>{empresa.empresa}</span>;

  React.useEffect(() => {
    if (openMenuKeys) {
      setOpenKeys(openMenuKeys);
    }
  }, [openMenuKeys]);

  return (
    <Sider style={siderStyle} trigger={null} collapsible collapsed={collapsed}>
    
      {/* Modal */}
      <EmpresaSelectorModal
        visible={modalVisible}
        empresas={empresas}
        empresaActual={empresaActual}
        loading={loading} 
        setLoading={setLoading}
        onClose={()=>setModalVisible(!modalVisible)}
      />

      <div className="logo-container">
        <Tooltip color="#2c4257c4" 
          placement="rightTop" 
          className={`${logoUrl ? '' : 'logoBoxCard'}`}
          title={text}>
          <img onClick={()=>loadEmpresas()} src={logoUrl ? logoUrl : boxCard} alt="Logo" className="logo-image" />
        </Tooltip>        
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedMenuKey]} // El ítem activo
        openKeys={openKeys}              // Los sub-menús expandidos
        onOpenChange={onOpenChange}      // Controlar expansión manual
        items={menuItems}
      />
    </Sider>
  );
};

export default LeftSidebar;