import * as React from 'react';
import Main from '../../../../util/main';
import MainIcon from '../../../../util/mainIcon';

const IconSelector = ({ value, onChange }) => {
    const [visible, setVisible] = React.useState(false);
    
    // Obtener todos los nombres de iconos de MainIcon (excluyendo iconMap y otros objetos)
    const iconNames = Object.keys(MainIcon).filter(key => 
        typeof MainIcon[key] === 'object' || typeof MainIcon[key] === 'function'
    ).filter(key => key !== 'iconMap' && key !== 'default');

    const handleSelect = (iconName) => {
        onChange(iconName);
        setVisible(false);
    };

    const SelectedIcon = (value && MainIcon[value]) ? MainIcon[value] : MainIcon.QuestionOutlined;

    const content = (
        <div style={{ 
            maxWidth: '350px', 
            maxHeight: '400px', 
            overflowY: 'auto', 
            padding: '10px' 
        }}>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)', 
                gap: '8px' 
            }}>
                {iconNames.map(name => {
                    const Icon = MainIcon[name];
                    if (!Icon) return null;
                    
                    return (
                        <div 
                            key={name}
                            onClick={() => handleSelect(name)}
                            style={{
                                cursor: 'pointer',
                                padding: '8px',
                                border: '1px solid #f0f0f0',
                                borderRadius: '4px',
                                textAlign: 'center',
                                background: value === name ? '#e6f7ff' : 'transparent',
                                borderColor: value === name ? '#1890ff' : '#f0f0f0'
                            }}
                            title={name}
                        >
                            <Icon style={{ fontSize: '20px' }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <Main.Popover
            content={content}
            title="Seleccionar Icono"
            trigger="click"
            open={visible}
            onOpenChange={setVisible}
            placement="bottomLeft"
        >
            <Main.Button icon={SelectedIcon ? <SelectedIcon /> : null}>
                {value || 'Seleccionar...'}
            </Main.Button>
        </Main.Popover>
    );
};

export default IconSelector;
