import * as React from 'react';
import Main     from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const { Option } = Main.Select;

const EmpresaPagesStickyView = React.memo(({  currentPage
                                            , pageSize
                                            , total
                                            , totalPages
                                            , startItem
                                            , endItem
                                            , pageNumbers
                                            , onPageChange
                                            , onPageSizeChange
                                            }) => {
  
  return (
    <div className="pagination-sticky-container">
      <div className="pagination-sticky-content">        
                
        {/* INFO IZQUIERDA */}
        <div className="pagination-info-left">
          <span className="pagination-text">
            Mostrando <strong>{startItem}-{endItem}</strong> de <strong>{total}</strong> empresas
          </span>
          
          {/* SELECTOR DE TAMAÑO */}
          <div className="pagination-size-selector">
            <span className="size-label">Mostrar:</span>
            <Main.Select
              value={pageSize}
              onChange={onPageSizeChange}
              className="size-select"
              size="small"
            >
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Main.Select>
          </div>
        </div>
        
        {/* CONTROLES DERECHA */}
        <div className="pagination-controls-right">
          
          {/* BOTÓN ANTERIOR */}
          <button
            className="page-btn-sticky"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Página anterior"
          >
            <MainIcon.LeftOutlined />
          </button>

          {/* NÚMEROS DE PÁGINA */}
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="page-ellipsis-sticky">
                  ...
                </span>
              );
            }

            return (
              <button
                key={pageNum}
                className={`page-btn-sticky ${pageNum === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          {/* BOTÓN SIGUIENTE */}
          <button
            className="page-btn-sticky"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Página siguiente"
          >
            <MainIcon.RightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
});

export default EmpresaPagesStickyView;