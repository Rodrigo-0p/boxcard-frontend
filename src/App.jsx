import React              from "react";
import AppRouter          from "./router/AppIndex";
import { ConfigProvider,App as AntdApp } from 'antd';
import esES               from 'antd/locale/es_ES';
import { BrowserRouter }  from "react-router-dom";
import { AuthProvider }   from "./context/AuthContext";
import './assets/css/main.css';

const App = ()=> {
  const [primary, setPrimary] = React.useState('#2a4b75ff'); //#001529
// .ant-menu-dark.ant-menu-inline .ant-menu-sub.ant-menu-inline, .ant-menu-dark>.ant-menu.ant-menu-inline .ant-menu-sub.ant-menu-inline
  const customTheme = {
    hashed: false,
    token: {
              colorPrimary: primary,
           }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider locale={esES} theme={customTheme}>
          <AntdApp>
            <AppRouter />          
          </AntdApp>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>     
  );
}
export default App;