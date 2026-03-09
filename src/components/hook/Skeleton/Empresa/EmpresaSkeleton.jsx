import { Skeleton, SkeletonCircle } from '../Skeleton';
import './EmpresaSkeleton.css';

export const EmpresaHeaderSkeleton = () => {
  return (
    <div className="empresa-header-skeleton">
      <div>
        <Skeleton width="200px" height="28px" marginBottom="8px" />
        <Skeleton width="150px" height="16px" />
      </div>
      <div className="header-actions-skeleton">
        <Skeleton width="100px" height="40px" borderRadius="8px" />
        <Skeleton width="40px" height="40px" borderRadius="8px" />
        <Skeleton width="150px" height="40px" borderRadius="8px" />
      </div>
    </div>
  );
};

export const EmpresaToolbarSkeleton = () => {
  return (
    <div className="empresa-toolbar-skeleton">
      <Skeleton width="400px" height="40px" borderRadius="8px" />
      <div className="toolbar-filters-skeleton">
        <Skeleton width="150px" height="40px" borderRadius="8px" />
        <Skeleton width="120px" height="40px" borderRadius="8px" />
        <Skeleton width="80px" height="40px" borderRadius="8px" />
      </div>
    </div>
  );
};

export const EmpresaCardSkeleton = () => {
  return (
    <div className="empresa-card-skeleton">
      {/* Header del card */}
      <div className="card-header-skeleton">
        <SkeletonCircle size="56px" />
        <Skeleton width="70px" height="24px" borderRadius="12px" />
      </div>

      {/* Nombre */}
      <Skeleton width="80%" height="20px" marginBottom="16px" />

      {/* Info */}
      <div className="card-info-skeleton">
        <Skeleton width="100%" height="16px" marginBottom="8px" />
        <Skeleton width="90%" height="16px" marginBottom="8px" />
        <Skeleton width="70%" height="16px" marginBottom="12px" />
      </div>

      {/* RUC */}
      <Skeleton width="50%" height="16px" marginBottom="12px" />

      {/* Tags */}
      <div className="card-tags-skeleton">
        <Skeleton width="90px" height="24px" borderRadius="12px" />
        <Skeleton width="80px" height="24px" borderRadius="12px" />
      </div>

      {/* Acciones */}
      <div className="card-actions-skeleton">
        <Skeleton width="60px" height="32px" borderRadius="6px" />
        <Skeleton width="60px" height="32px" borderRadius="6px" />
        <Skeleton width="70px" height="32px" borderRadius="6px" />
      </div>
    </div>
  );
};

export const EmpresasSkeletonGrid = ({ count = 3 }) => {
  return (
    <div className="empresas-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <EmpresaCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const EmpresaSkeleton = () => {
  return (
    <div className="empresa-dashboard-skeleton">
      <EmpresaHeaderSkeleton />
      <EmpresaToolbarSkeleton />
      <EmpresasSkeletonGrid count={3} />
    </div>
  );
};