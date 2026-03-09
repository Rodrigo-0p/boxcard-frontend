import React from 'react';
import { Skeleton, SkeletonCircle } from '../Skeleton';
import './BeneficiarioSkeleton.css';

export const BeneficiarioHeaderSkeleton = () => {
    return (
        <div className="beneficiario-header-skeleton">
            <div>
                <Skeleton width="200px" height="28px" marginBottom="8px" />
                <Skeleton width="150px" height="16px" />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <Skeleton width="40px" height="40px" borderRadius="8px" />
                <Skeleton width="180px" height="40px" borderRadius="8px" />
                <Skeleton width="120px" height="40px" borderRadius="8px" />
            </div>
        </div>
    );
};

export const BeneficiarioToolbarSkeleton = () => {
    return (
        <div className="beneficiario-toolbar-skeleton">
            <Skeleton width="400px" height="40px" borderRadius="8px" />
            <div style={{ display: 'flex', gap: '12px' }}>
                <Skeleton width="150px" height="40px" borderRadius="8px" />
                <Skeleton width="60px" height="40px" borderRadius="8px" />
            </div>
        </div>
    );
};

export const BeneficiarioCardSkeleton = () => {
    return (
        <div className="beneficiario-card-skeleton">
            <div className="benef-card-header-skeleton">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <SkeletonCircle size="48px" />
                    <div>
                        <Skeleton width="180px" height="18px" marginBottom="6px" />
                        <Skeleton width="120px" height="14px" />
                    </div>
                </div>
                <Skeleton width="60px" height="22px" borderRadius="4px" />
            </div>

            <div className="benef-card-info-skeleton">
                <Skeleton width="150px" height="14px" marginBottom="10px" />
                <Skeleton width="200px" height="14px" marginBottom="10px" />
                <Skeleton width="100px" height="14px" marginBottom="10px" />
            </div>

            <div className="benef-card-footer-skeleton">
                <Skeleton width="60px" height="24px" />
                <Skeleton width="60px" height="24px" />
                <Skeleton width="60px" height="24px" />
            </div>
        </div>
    );
};

export const BeneficiarioSkeletonGrid = ({ count = 3 }) => {
    return (
        <div className="beneficiarios-skeleton-grid">
            {Array.from({ length: count }).map((_, index) => (
                <BeneficiarioCardSkeleton key={index} />
            ))}
        </div>
    );
};

export const BeneficiarioSkeleton = (props) => {
    return (
        <div className="beneficiario-dashboard-skeleton">
            <BeneficiarioHeaderSkeleton />
            <BeneficiarioToolbarSkeleton />
            <BeneficiarioSkeletonGrid count={props.count || 3} />
        </div>
    );
};
