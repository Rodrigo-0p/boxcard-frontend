import EMPRESA from '../../pages/adm/empresa/EMPRESA';
import PERSONA from '../../pages/adm/persona/PERSONA';
import CONFIRMACION from '../../pages/adm/confirmacion/CONFIRMACION';
import SOLICITUD_REPORTE from '../../pages/adm/solicitud/SOLICITUD_REPORTE';

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
    path: "/adm/confirmacion",
    component: CONFIRMACION,
  },
  {
    path: "/adm/reporte-solicitudes",
    component: SOLICITUD_REPORTE,
  }
]

export default Route
