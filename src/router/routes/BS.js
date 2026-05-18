import SOLICITUD from '../../pages/base/solicitud/SOLICITUD';
import BENEFICIARIOS from '../../pages/base/beneficiarios/BENEFICIARIOS';
import ADM_DASHBOARD from '../../pages/base/dashboard/ADM_DASHBOARD';

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
]

export default Route