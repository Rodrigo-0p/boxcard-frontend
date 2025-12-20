import { Navigate, useLocation } from 'react-router-dom';
import { useAuth  } from '../context/AuthContext';
import main         from '../util/main';
export default function ProtectedRoute({ children }) {
const { usuario, loading, menus } = useAuth();

 const location = useLocation()

   if (loading){
    return < main.DashboardSkeleton />;
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }
  
  const tieneAccesoARuta = () => {
    // Buscar la ruta en los menús
    const buscarEnMenus = (menus) => {
      for (const menu of menus) {
        // Verificar si la ruta coincide con el menú actual
        if (menu.path === location.pathname) {
          return true;
        }

        // Si tiene submenús, buscar recursivamente
        if (menu.children && Array.isArray(menu.children ) && menu.children .length > 0) {
          if (buscarEnMenus(menu.children)) {
            return true;
          }
        }
      }
      return false;
    };
    return buscarEnMenus(menus);
  };
  
  if (!tieneAccesoARuta()) {
    return <Navigate to="/404" replace />;
  }

  return children;
}