import * as React from 'react';
import { Skeleton, SkeletonTable } from '../Skeleton';

export const GestionAccesoSkeleton = () => {
    return (
        <div style={{ padding: '24px' }}>
            {/* Header Skeleton Mimic */}
            <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '20px 28px', 
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1 }}>
                    <Skeleton width="280px" height="28px" marginBottom="12px" />
                    <Skeleton width="400px" height="14px" />
                </div>
            </div>

            {/* Tabs Skeleton Mimic */}
            <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '0' }}>
                    <Skeleton width="180px" height="40px" borderRadius="8px 8px 0 0" />
                    <Skeleton width="180px" height="40px" borderRadius="8px 8px 0 0" />
                    <Skeleton width="180px" height="40px" borderRadius="8px 8px 0 0" />
                </div>
                
                {/* Content Area Skeleton */}
                <div style={{ 
                    background: 'white', 
                    padding: '24px', 
                    borderRadius: '0 0 12px 12px',
                    border: '1px solid #f0f0f0',
                    borderTop: 'none'
                }}>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton width="200px" height="32px" />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Skeleton width="100px" height="32px" />
                            <Skeleton width="32px" height="32px" borderRadius="6px" />
                        </div>
                    </div>
                    <SkeletonTable rows={10} columns={5} hasHeader={true} />
                </div>
            </div>
        </div>
    );
};
