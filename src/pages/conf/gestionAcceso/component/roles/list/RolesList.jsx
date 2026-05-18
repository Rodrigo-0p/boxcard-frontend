import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';

const RolesList = ({ roles, selectedRole, onSelect, loading }) => {
    const [searchText, setSearchText] = React.useState('');

    const filteredRoles = roles.filter(r => 
        r.nombre_role.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div style={{ 
            width: '280px', 
            borderRight: '1px solid #f0f0f0', 
            paddingRight: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        }}>
            <Main.Input 
                placeholder="Buscar rol..." 
                prefix={<MainIcon.SearchOutlined />} 
                onChange={e => setSearchText(e.target.value)}
                allowClear
            />

            <div style={{ 
                overflowY: 'auto', 
                maxHeight: 'calc(100vh - 350px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                {loading && roles.length === 0 ? <Main.Spin style={{ marginTop: 20 }} /> : (
                    filteredRoles.map(r => (
                        <div 
                            key={r.cod_role}
                            onClick={() => onSelect(r.cod_role)}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: selectedRole === r.cod_role ? '#e6f7ff' : '#fff',
                                border: `1px solid ${selectedRole === r.cod_role ? '#91d5ff' : '#f0f0f0'}`,
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: selectedRole === r.cod_role ? '0 2px 4px rgba(24, 144, 255, 0.1)' : 'none'
                            }}
                            className="role-item-link"
                        >
                            <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%', 
                                background: selectedRole === r.cod_role ? '#1890ff' : '#f5f5f5',
                                color: selectedRole === r.cod_role ? '#fff' : '#8c8c8c',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px'
                            }}>
                                <MainIcon.UserOutlined />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ 
                                    fontWeight: 600, 
                                    color: selectedRole === r.cod_role ? '#003a8c' : '#262626',
                                    fontSize: '13px'
                                }}>
                                    {r.nombre_role}
                                </div>
                                <div style={{ fontSize: '11px', color: '#8c8c8c' }}>DB Role: {r.cod_role}</div>
                            </div>
                        </div>
                    ))
                )}
                {!loading && filteredRoles.length === 0 && (
                    <Main.Empty description="Sin roles" image={Main.Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>
        </div>
    );
};

export default RolesList;
