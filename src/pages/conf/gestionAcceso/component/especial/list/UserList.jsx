import * as React from 'react';
import Main from '../../../../../../util/main';
import MainIcon from '../../../../../../util/mainIcon';

const UserList = ({ users, selectedUser, onSelect, loading, assignedPerms }) => {
    const [searchText, setSearchText] = React.useState('');

    const filteredUsers = React.useMemo(() => {
        if (!searchText) return users;
        const lowerSearch = Main.normalize(searchText);
        return users.filter(u => 
            (u.usuario_pg && Main.normalize(u.usuario_pg).includes(lowerSearch)) ||
            (u.descripcion && Main.normalize(u.descripcion).includes(lowerSearch))
        );
    }, [users, searchText]);

    const getPermCount = (usuario_pg) => {
        return (assignedPerms || []).filter(p => p.usuario_pg === usuario_pg).length;
    };

    return (
        <div style={{ 
            width: '320px', 
            background: '#fff', 
            border: '1px solid #f0f0f0', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            height: 'fit-content',
            maxHeight: '600px'
        }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <Main.Input 
                    placeholder="Buscar usuario..." 
                    prefix={<MainIcon.SearchOutlined style={{ color: '#bfbfbf' }} />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
            </div>
            
            <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
                <Main.Spin spinning={loading}>
                    <Main.List
                        dataSource={filteredUsers}
                        renderItem={user => {
                            const isSelected = selectedUser === user.usuario_pg;
                            const count = getPermCount(user.usuario_pg);
                            
                            return (
                                <div 
                                    onClick={() => onSelect(user.usuario_pg)}
                                    style={{ 
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        marginBottom: '4px',
                                        background: isSelected ? '#e6f7ff' : 'transparent',
                                        transition: 'all 0.3s',
                                        border: isSelected ? '1px solid #91d5ff' : '1px solid transparent'
                                    }}
                                    className="user-list-item"
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ 
                                                fontSize: '14px', 
                                                fontWeight: 600, 
                                                color: isSelected ? '#1890ff' : '#262626' 
                                            }}>
                                                {user.usuario_pg}
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                                {user.descripcion || 'Sin nombre'}
                                            </span>
                                        </div>
                                        {count > 0 && (
                                            <Main.Badge count={count} style={{ backgroundColor: '#52c41a' }} />
                                        )}
                                    </div>
                                </div>
                            );
                        }}
                    />
                </Main.Spin>
            </div>
        </div>
    );
};

export default UserList;
