import {Route, Routes } from 'react-router-dom';
// Rutas no definidas
import NotFound         from './AppRouter404';
import Login            from '../pages/login/Login';
import ProtectedRoute   from "./ProtectedRoute";

// MODULOS
import BS   from './routes/BS';
import ADM  from './routes/ADM';
import CONF from './routes/CONF';
import Main from '../util/main';

const AppRouter = () => {
  const route  = Main._.union(BS,ADM,CONF);

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        {route.map((ruta, indice) => (
          <Route 
            key     ={ indice    } 
            path    ={ ruta.path } 
            element ={  <ProtectedRoute>
                          <ruta.component />
                        </ProtectedRoute>} 
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
};

export default AppRouter;