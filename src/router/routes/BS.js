import SOLICITUD from '../../pages/base/solicitud/SOLICITUD';
import BENEFICIARIOS from '../../pages/base/beneficiarios/BENEFICIARIOS';
import ADM_DASHBOARD from '../../pages/base/dashboard/ADM_DASHBOARD';
import SOLICITUD_REPORTE from '../../pages/base/solicitud/SOLICITUD_REPORTE';

const Route = [
  {
    path: "/dashboard",
    component: ADM_DASHBOARD,
  },
  {
    path: "/solicitudes",
    component: SOLICITUD,
  },
  {
    path: "/beneficiarios",
    component: BENEFICIARIOS,
  },
  {
    path: "/reporte-solicitudes",
    component: SOLICITUD_REPORTE,
  },
]

export default Route