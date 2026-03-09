import React from 'react';
import { Skeleton, SkeletonCircle } from '../Skeleton';
import './SolicitudSkeleton.css';

export const SolicitudHeaderSkeleton = () => {
    return (
        <div className="solicitud-header-skeleton">
            <div>
                <Skeleton width="220px" height="32px" marginBottom="8px" />
                <Skeleton width="160px" height="16px" />
            </div>
            <div className="header-right-skeleton">
                <Skeleton width="40px" height="40px" borderRadius="8px" />
                <Skeleton width="150px" height="40px" borderRadius="8px" />
            </div>
        </div>
    );
};

export const SolicitudCardSkeleton = () => {
    return (
        <div className="solicitud-card-skeleton">
            {/* Header del card */}
            <div className="card-top-skeleton">
                <div>
                    <Skeleton width="80px" height="14px" marginBottom="4px" />
                    <Skeleton width="100px" height="12px" />
                </div>
                <Skeleton width="90px" height="24px" borderRadius="6px" />
            </div>

            {/* Body */}
            <div className="card-body-skeleton">
                <Skeleton width="80px" height="12px" marginBottom="8px" />
                <Skeleton width="200px" height="18px" marginBottom="20px" />

                <div className="card-box-skeleton">
                    <div style={{ width: '60%' }}>
                        <Skeleton width="80px" height="10px" marginBottom="4px" />
                        <Skeleton width="100px" height="18px" />
                    </div>
                    <div style={{ width: '30%', textAlign: 'right' }}>
                        <Skeleton width="60px" height="10px" marginBottom="4px" />
                        <Skeleton width="40px" height="18px" />
                    </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SkeletonCircle size="24px" />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="120px" height="12px" marginBottom="4px" />
                        <Skeleton width="80px" height="10px" />
                    </div>
                    <Skeleton width="60px" height="20px" borderRadius="10px" />
                </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* Acciones */}
            <div className="card-actions-skeleton">
                <SkeletonCircle size="32px" />
                <SkeletonCircle size="32px" />
                <SkeletonCircle size="32px" />
                <div style={{ flex: 1 }} />
                <Skeleton width="80px" height="32px" borderRadius="6px" />
            </div>
        </div>
    );
};

export const SolicitudSkeletonGrid = ({ count = 3 }) => {
    return (
        <div className="solicitud-skeleton-grid">
            {Array.from({ length: count }).map((_, index) => (
                <SolicitudCardSkeleton key={index} />
            ))}
        </div>
    );
};

export const SolicitudSkeleton = (props) => {
    return (
        <div className="solicitud-dashboard-skeleton">
            <SolicitudHeaderSkeleton />
            <SolicitudSkeletonGrid count={props.count || 3} />
        </div>
    );
};
