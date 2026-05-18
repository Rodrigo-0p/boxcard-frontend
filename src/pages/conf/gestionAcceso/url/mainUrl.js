const url_base = '/adm/configuracion';

const MainUrl = {
    url_menus_listar: `${url_base}/menus/listar`,
    url_menus_guardar: `${url_base}/menus/guardar`,
    url_menus_eliminar: `${url_base}/menus/eliminar`,
    url_roles_listar: `${url_base}/roles/listar`,
    url_roles_menus: `${url_base}/roles/menus`, // + /:cod_role
    url_roles_menus_guardar: `${url_base}/roles/menus/guardar`,
    url_roles_menus_guardar_bulk: `${url_base}/roles/menus/guardar-bulk`,
    url_especiales_listar: `${url_base}/especiales/listar`,
    url_especiales_guardar: `${url_base}/especiales/guardar`,
    url_especiales_guardar_bulk: `${url_base}/especiales/guardar-bulk`,
    url_especiales_eliminar: `${url_base}/especiales/eliminar`,
};

export default MainUrl;
