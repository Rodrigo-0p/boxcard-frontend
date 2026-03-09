import EMPRESA from '../../pages/adm/empresa/EMPRESA';
import PERSONA from '../../pages/adm/persona/PERSONA';
import SOLICITUD from '../../pages/adm/solicitud/SOLICITUD';
import BENEFICIARIOS from '../../pages/adm/beneficiarios/BENEFICIARIOS';
import CONFIRMACION from '../../pages/adm/confirmacion/CONFIRMACION';

const Route = [
  {
    path: "/adm/empresa",
    component: EMPRESA,
  },
  {
    path: "/adm/persona",
    component: PERSONA,
  },
  {
    path: "/adm/solicitudes",
    component: SOLICITUD,
  },
  {
    path: "/adm/beneficiarios",
    component: BENEFICIARIOS,
  },
  {
    path: "/adm/confirmacion",
    component: CONFIRMACION,
  },
]

export default Route
