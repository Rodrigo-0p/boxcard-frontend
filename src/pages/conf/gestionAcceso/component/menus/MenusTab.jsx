import * as React from 'react';
import Main from '../../../../../util/main';
import MainUrl from '../../url/mainUrl';
import MenusHeader from './header/MenusHeader';
import MenusToolBar from './toolBar/MenusToolBar';
import MenusTable from './table/MenusTable';
import MenusModal from './modal/MenusModal';

const MenusTab = ({ initialMenus, onRefreshParent }) => {
    // Estados de datos
    const [menus, setMenus] = React.useState(initialMenus || []);
    const [filteredMenus, setFilteredMenus] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    
    // Estados de UI
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedMenu, setSelectedMenu] = React.useState(null);
    const [filters, setFilters] = React.useState({ searchText: '', estadoFilter: 'all' });
    
    // Paginación
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    
    const message = Main.useMessage();
    const { permisos } = Main.useAuth();

    // Carga de datos
    const loadMenus = async () => {
        if (onRefreshParent) {
            await onRefreshParent();
            return;
        }
        setLoading(true);
        try {
            const resp = await Main.Request(MainUrl.url_menus_listar, 'GET');
            if (resp.data.success) {
                setMenus(resp.data.data);
                applyFilters(resp.data.data, filters);
            } else {
                message.error(resp.data.message || 'Error al cargar datos');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            message.error('Fallo en la conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    // Utilidad para transformar lista plana a árbol
    const transformToTree = (data) => {
        const map = {};
        const tree = [];

        data.forEach(item => {
            map[item.cod_menu] = { ...item, key: item.cod_menu, children: [] };
        });

        data.forEach(item => {
            if (item.cod_menu_padre && map[item.cod_menu_padre]) {
                map[item.cod_menu_padre].children.push(map[item.cod_menu]);
            } else {
                tree.push(map[item.cod_menu]);
            }
        });

        const cleanEmptyChildren = (nodes) => {
            nodes.forEach(node => {
                if (node.children.length === 0) {
                    delete node.children;
                } else {
                    cleanEmptyChildren(node.children);
                }
            });
        };
        cleanEmptyChildren(tree);
        return tree;
    };

    // Aplicar filtros localmente manteniendo jerarquía
    const applyFilters = (data, currentFilters) => {
        const { searchText, estadoFilter } = currentFilters;
        
        // 1. Filtrado básico
        let filtered = data.filter(m => {
            const matchesEstado = estadoFilter === 'all' || m.estado === estadoFilter;
            const matchesSearch = !searchText || (
                (m.nombre_menu && m.nombre_menu.toLowerCase().includes(searchText.toLowerCase())) ||
                (m.ruta && m.ruta.toLowerCase().includes(searchText.toLowerCase()))
            );
            return matchesEstado && matchesSearch;
        });

        // 2. Si hay búsqueda, asegurar que los padres de los elementos encontrados estén presentes
        if (searchText || estadoFilter !== 'all') {
            const resultIds = new Set(filtered.map(m => m.cod_menu));
            const finalData = [];
            
            // Función para añadir ancestros
            const addAncestors = (item) => {
                if (item.cod_menu_padre) {
                    const parent = data.find(m => m.cod_menu === item.cod_menu_padre);
                    if (parent && !resultIds.has(parent.cod_menu)) {
                        resultIds.add(parent.cod_menu);
                        finalData.push(parent);
                        addAncestors(parent);
                    }
                }
            };

            filtered.forEach(m => {
                finalData.push(m);
                addAncestors(m);
            });
            
            // Eliminar duplicados si los hay (aunque Set ayuda)
            const uniqueData = Array.from(new Map(finalData.map(item => [item.cod_menu, item])).values());
            setFilteredMenus(transformToTree(uniqueData));
        } else {
            setFilteredMenus(transformToTree(data));
        }

        setCurrentPage(1);
    };

    React.useEffect(() => {
        if (!initialMenus || initialMenus.length === 0) {
            loadMenus();
        }
    }, []);

    React.useEffect(() => {
        if (initialMenus) {
            setMenus(initialMenus);
            applyFilters(initialMenus, filters);
        }
    }, [initialMenus]);

    React.useEffect(() => {
        applyFilters(menus, filters);
    }, [filters, menus]);

    // Manejadores de eventos
    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleCreate = () => {
        setSelectedMenu(null);
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedMenu(record);
        setModalVisible(true);
    };

    const handleDelete = async (record) => {
        Main.Modal.confirm({
            title: '¿Está seguro de eliminar este menú?',
            content: `Se eliminará "${record.nombre_menu}" y sus accesos asociados. Esta acción no se puede deshacer.`,
            okText: 'Sí, Eliminar',
            okType: 'danger',
            cancelText: 'Mejor No',
            onOk: async () => {
                setLoading(true);
                try {
                    const resp = await Main.Request(MainUrl.url_menus_eliminar, 'POST', { cod_menu: record.cod_menu });
                    if (resp.data.success) {
                        message.success(resp.data.message);
                        loadMenus();
                    } else {
                        message.error(resp.data.message);
                    }
                } catch (error) {
                    message.error('Error al intentar eliminar');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                isNew: !selectedMenu,
                cod_menu: selectedMenu?.cod_menu
            };

            const resp = await Main.Request(MainUrl.url_menus_guardar, 'POST', payload);
            if (resp.data.success) {
                message.success(resp.data.message);
                setModalVisible(false);
                loadMenus();
            } else {
                message.error(resp.data.message);
            }
        } catch (error) {
            console.error('Save error:', error);
            message.error('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    // Permisos simulados si no vienen del contexto
    const activePermisos = permisos?.menus || { insert: true, update: true, delete: true };

    // Cálculo de datos paginados sobre los NODOS RAÍZ
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedMenus = filteredMenus.slice(startIndex, startIndex + pageSize);

    return (
        <div className="menus-tab-container">
            <MenusHeader 
                totalMenus={filteredMenus.length} 
                onRefreshData={loadMenus} 
                onCreate={handleCreate} 
                permisos={activePermisos}
            />

            <MenusToolBar 
                onFiltersChange={handleFiltersChange} 
            />

            <div style={{ marginTop: '16px' }}>
                <MenusTable 
                    data={paginatedMenus} 
                    loading={loading} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    permisos={activePermisos}
                />
            </div>

            <Main.Pages
                currentPage={currentPage}
                pageSize={pageSize}
                total={filteredMenus.length}
                label="menús"
                variant="inline"
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />

            <MenusModal 
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onSave={handleSave}
                loading={loading}
                selectedMenu={selectedMenu}
                menusList={menus}
            />
        </div>
    );
};

export default MenusTab;
