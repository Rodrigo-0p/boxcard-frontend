import React         from 'react';
import { Layout }    from 'antd';
import LeftSidebar   from './LeftSidebar';
import Navbar        from './Navbar';
import Main          from '../../util/main';

const { Content } = Layout;

const MainLayout = ({ children, selectedMenuKey='1', openMenuKeys }) => {
  const [collapsed, setCollapsed] = React.useState(JSON.parse(Main.nvl(sessionStorage.getItem("collapsed"),false)));

  return (
    <Layout style={{ minHeight: '100vh' }}  hasSider>
      <LeftSidebar 
        collapsed       ={ collapsed       } 
        selectedMenuKey ={ selectedMenuKey }
        openMenuKeys    ={ openMenuKeys    }  // Pasar los keys de menús a expandir
      />
      <Layout>
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <Content style={{ margin: 24, overflow: 'auto' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;