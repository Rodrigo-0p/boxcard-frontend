import * as React from 'react';
import EmpresaPagesStickyView from './EmpresaPagesStickyView';
import './EmpresaPagesSticky.css'

const EmpresaPagesSticky = ({ currentPage = 1,
                              pageSize    = 10,
                              total       = 0,
                              onPageChange,
                              onPageSizeChange
                            }) => {

  const [isVisible  , setIsVisible ] = React.useState(false);
  const [isAtBottom , setIsAtBottom] = React.useState(false);
  const [isPinned   , setIsPinned  ] = React.useState(false);

  // ========================================
  // CALCULAR DATOS DE PAGINACIÓN
  // ========================================
  const totalPages = Math.ceil(total / pageSize);
  const startItem  = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem    = Math.min(currentPage * pageSize, total);

  // ========================================
  // DETECTAR SCROLL
  // ========================================
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // VISIBLE si ha scrolleado más de 110px
      setIsVisible(scrollTop > 110);
      
      // AT BOTTOM si está cerca del final (100px antes)
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 100;
      setIsAtBottom(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar inmediatamente

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ========================================
  // HANDLERS
  // ========================================
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  // ========================================
  // GENERAR NÚMEROS DE PÁGINA
  // ========================================
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // ========================================
  // RENDER
  // ========================================
  if (totalPages <= 1) {
    return null;
  }

  return (
    <EmpresaPagesStickyView
      currentPage      = { currentPage      }
      pageSize         = { pageSize         }
      total            = { total            }
      totalPages       = { totalPages       }
      startItem        = { startItem        }
      endItem          = { endItem          }
      pageNumbers      = { getPageNumbers() }
      isVisible        = { isVisible        }
      isAtBottom       = { isAtBottom       }
      onPageChange     = { handlePageChange }
      onPageSizeChange = { handlePageSizeChange       }
      isPinned         = { isPinned         } 
      onTogglePin      = { ()=>setIsPinned(!isPinned) }
    />
  );
};

export default EmpresaPagesSticky;