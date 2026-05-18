import * as React from 'react';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const MenusTree = ({ menus, checkedKeys, onCheck, loading, title = "ESTRUCTURA DE NAVEGACIÓN" }) => {
    
    // Construir el árbol para Ant Design Tree
    const menuTree = React.useMemo(() => {
        const buildTree = (parentId = null) => {
            return (menus || [])
                .filter(m => m.cod_menu_padre === parentId)
                .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                .map(m => {
                    const iconName = m.icono || 'FileOutlined';
                    const IconComp = MainIcon[iconName] || MainIcon.FileOutlined;
                    return {
                        title: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                                {IconComp ? <IconComp style={{ color: '#8c8c8c' }} /> : <MainIcon.FileOutlined style={{ color: '#8c8c8c' }} />}
                                <span style={{ fontSize: '14px' }}>{m.nombre_menu}</span>
                            </div>
                        ),
                        key: m.cod_menu.toString(),
                        children: buildTree(m.cod_menu)
                    };
                });
        };
        return buildTree(null);
    }, [menus]);

    return (
        <Main.Spin spinning={loading} tip="Cargando estructura...">
            <div style={{ 
                padding: '24px', 
                background: '#fff', 
                border: '1px solid #f0f0f0', 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                minHeight: '400px'
            }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 500 }}>{title}</span>
                    <Main.Space size="small">
                        <Main.Button size="small" type="link" onClick={() => onCheck((menus || []).map(m => m.cod_menu.toString()))}>Marcar Todo</Main.Button>
                        <Main.Button size="small" type="link" onClick={() => onCheck([])} danger>Desmarcar Todo</Main.Button>
                    </Main.Space>
                </div>
                
                <Main.Tree
                    checkable
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    treeData={menuTree}
                    defaultExpandAll
                    className="custom-permisos-tree"
                    style={{ fontSize: '14px' }}
                />
            </div>
        </Main.Spin>
    );
};

export default MenusTree;
