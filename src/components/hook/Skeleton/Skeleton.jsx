import './Skeleton.css';

export const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  marginBottom = '0',
  style = {},
  variant = 'light' // 'light' o 'dark'
}) => {
  const backgroundColor = variant === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : '#f0f0f0';

  return (
    <div 
      className="skeleton-box"
      style={{ 
        width, 
        height, 
        borderRadius,
        marginBottom,
        background: backgroundColor,
        ...style 
      }}
    />
  );
};

export const SkeletonCircle = ({ 
  size = '40px', 
  style = {},
  variant = 'light'
}) => {
  return (
    <Skeleton 
      width={size} 
      height={size} 
      borderRadius="50%" 
      style={style}
      variant={variant}
    />
  );
};

export const SkeletonText = ({ 
  lines = 3, 
  width = '100%',
  height = '16px',
  gap = '12px',
  lastLineWidth = '60%',
  style = {}
}) => {
  return (
    <div style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : width}
          height={height}
          marginBottom={index < lines - 1 ? gap : '0'}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ 
  hasAvatar = false,
  lines = 3,
  style = {}
}) => {
  return (
    <div style={{ 
      background: '#fff', 
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      ...style
    }}>
      {hasAvatar && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <SkeletonCircle size="48px" />
          <div style={{ flex: 1 }}>
            <Skeleton width="150px" height="20px" marginBottom="8px" />
            <Skeleton width="100px" height="16px" />
          </div>
        </div>
      )}
      <SkeletonText lines={lines} />
    </div>
  );
};

export const SkeletonTable = ({ 
  rows = 5,
  columns = 4,
  hasHeader = true,
  style = {}
}) => {
  return (
    <div style={{ 
      background: '#fff', 
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      ...style
    }}>
      {hasHeader && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} width="80%" height="20px" />
          ))}
        </div>
      )}
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '16px',
          marginBottom: '16px'
        }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              width={colIndex === 0 ? '90%' : '70%'} 
              height="16px" 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonStatCard = ({ style = {} }) => {
  return (
    <div style={{ 
      background: '#fff', 
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      ...style
    }}>
      <Skeleton width="60%" height="16px" marginBottom="16px" />
      <Skeleton width="120px" height="36px" marginBottom="8px" />
      <Skeleton width="80px" height="14px" />
    </div>
  );
};

export const SkeletonMenu = ({ 
  items = 6,
  variant = 'dark',
  style = {}
}) => {
  return (
    <div style={style}>
      {Array.from({ length: items }).map((_, index) => (
        <Skeleton 
          key={index}
          width="100%" 
          height="40px" 
          marginBottom="8px"
          variant={variant}
        />
      ))}
    </div>
  );
};