import { Skeleton, SkeletonCircle } from '../Skeleton';
import './PersonaSkeleton.css';

export const PersonaHeaderSkeleton = () => {
  return (
    <div className="persona-header-skeleton">
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

export const PersonaToolbarSkeleton = () => {
  return (
    <div className="persona-toolbar-skeleton">
      <Skeleton width="400px" height="40px" borderRadius="8px" />
      <div className="toolbar-filters-skeleton">
        <Skeleton width="150px" height="40px" borderRadius="8px" />
        <Skeleton width="120px" height="40px" borderRadius="8px" />
        <Skeleton width="80px" height="40px" borderRadius="8px" />
      </div>
    </div>
  );
};

export const PersonaCardSkeleton = () => {
  return (
    <div className="persona-card-skeleton">
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

export const PersonaSkeletonGrid = ({ count = 3 }) => {
  return (
    <div className="persona-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <PersonaCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const PersonaSkeleton = (props) => {
  return (
    <div className="persona-dashboard-skeleton">
      <PersonaHeaderSkeleton />
      <PersonaToolbarSkeleton />
      <PersonaSkeletonGrid count={props.count || 3} />
    </div>
  );
};