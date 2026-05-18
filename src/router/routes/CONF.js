import USUARIO from '../../pages/conf/usuario/USUARIO';
import CONFIGURACION from '../../pages/conf/gestionAcceso/CONFIGURACION';

const Route = [
    {
        path: "/conf/usuarios",
        component: USUARIO,
    },
    {
        path: "/conf/gestion-accesos",
        component: CONFIGURACION,
    },
]

export default Route;