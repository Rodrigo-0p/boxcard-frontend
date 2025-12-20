import * as React     from 'react';
import{ useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';


const AppRouter404 = React.memo(() => {
  const navegation = useNavigate();

  const redirecionar = ()=>{
    const session = sessionStorage.getItem("session");
    if (session) navegation("/dashboard");
    else navegation("/");
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="Esta página no existe o no cuentas con permisos suficientes."
      extra={<>
              <Button onClick={redirecionar} type="primary">Volver a inicio</Button> 
            </>}
      />
  );
});

export default AppRouter404;