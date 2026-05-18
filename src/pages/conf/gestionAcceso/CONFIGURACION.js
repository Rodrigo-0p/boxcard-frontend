import * as React from 'react';
import Main from '../../../util/main';
import MainIcon from '../../../util/mainIcon';
import MainLayout from '../../../components/layout/MainLayout';
import MainUrl from './url/mainUrl';
import './component/GestionAccesoHeader.css';

// Componentes internos
import MenusTab from './component/menus/MenusTab';
import RolesTab from './component/roles/RolesTab';
import PermisosEspecialesTab from './component/especial/PermisosEspecialesTab';

const cod_form = 16; // Según el SQL del usuario para Configuracion Sistema

const CONFIGURACION = () => {
    const menuProps = Main.useMenuNavigation(cod_form);
    const [activeTab, setActiveTab] = React.useState('1');
    const [loadingData, setLoadingData] = React.useState(true);
    const [allMenus, setAllMenus] = React.useState([]);
    
    const message = Main.useMessage();

    const loadGlobalData = async () => {
        setLoadingData(true);
        try {
            const resp = await Main.Request(MainUrl.url_menus_listar, 'GET');
            if (resp.data.success) {
                setAllMenus(resp.data.data || []);
            }
        } catch (error) {
            console.error('Error loading config data:', error);
            message.error('Error al cargar la configuración global');
        } finally {
            setLoadingData(true); // Wait, should be false
            setLoadingData(false);
        }
    };

    React.useEffect(() => {
        loadGlobalData();
    }, []);

    // Filtrar activos para las pestañas de asignación
    const activeMenus = React.useMemo(() => 
        allMenus.filter(m => m.estado === 'A'), 
    [allMenus]);

    const items = [
        {
            key: '1',
            label: (
                <span>
                    <MainIcon.ClusterOutlined />
                    Estructura de Menús
                </span>
            ),
            children: (
                <MenusTab initialMenus={allMenus} onRefreshParent={loadGlobalData} />
            ),
        },
        {
            key: '2',
            label: (
                <span>
                    <MainIcon.SafetyCertificateOutlined />
                    Roles y Permisos
                </span>
            ),
            children: (
                <RolesTab initialMenus={activeMenus} />
            ),
        },
        {
            key: '3',
            label: (
                <span>
                    <MainIcon.UserAddOutlined />
                    Estructura de Navegación
                </span>
            ),
            children: (
                <PermisosEspecialesTab initialMenus={activeMenus} />
            ),
        },
    ];

    const isInitialLoading = loadingData && allMenus.length === 0;

    return (
        <MainLayout {...menuProps}>
            {isInitialLoading ? (
                <Main.GestionAccesoSkeleton />
            ) : (
                <div style={{ padding: '24px' }} className="animate-fadeIn">
                    <div className="usuario-header">
                        <div className="header-left">
                            <h1 className="header-title">
                                <MainIcon.SettingOutlined />
                                Configuración del Sistema
                            </h1>
                            <p className="header-description">Gestión de parámetros globales, accesos y permisos.</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <Main.Tabs 
                            activeKey={activeTab} 
                            onChange={setActiveTab} 
                            items={items} 
                            type="card"
                            className="custom-tabs"
                        />
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default CONFIGURACION;
